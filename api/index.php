<?php

require 'config.php';

use Zend\Crypt\Password\Bcrypt;

$params = json_decode(file_get_contents('php://input'), true);

$action = $params['action'];

switch ($action) {

    case 'view-code':

        if ($database->has('quiz_forms', [ 'id' => $params['id'], 'code'=> $params['code']])) {
            $data['status'] = 1;
            $data['message'] = "code is correct";
        } else {
            $data['status'] = 0;
            $data['message'] = "Invalid code";
        }

        break;
    case 'login':

        $result = $database->select('student', [ 'password', 'id'], [ 'email' => $params['email']])[0];

        $bcrypt = new Bcrypt();
        $securePass = $result['password'];
        $password = md5($params['password']);

        //if ($bcrypt->verify($password, $securePass)) {
        if ($password == $securePass) {
            $token = md5($params['email'] . uniqid());
            if ($database->has('student', [ 'email' => $params['email']])) {
                $database->update('student', ['token' => $token], ['student_id' => $result['id']]);
            } else {
                $database->insert('student', ['student_id' => $result['id'], 'token' => $token]);
            }

            $data['status'] = 1;
            $data['message'] = "The password is correct!";
            $data['token'] = $token;
        } else {
            $data['status'] = 0;
            $data['message'] = "Invalid credentials";
        }

        break;

    case 'signup':

//        $title = $params['title'];
//        $form_json = $params['form_json'];

        $bcrypt = new Bcrypt();
        //$params['password'] = $bcrypt->create($params['password']);
        $params['password'] = md5($params['password']);

        unset($params['action'], $params['cpassword']);

        $r = $database->insert('student', $params);

        if ($r) {
            $data['status'] = 1;
            $data['message'] = 'User registration successfully completed';
            $data['results'] = $database->id();
        } else {
            $data['status'] = 0;
            $data['message'] = 'Some error occured';
        }
        break;

    case 'session':
        $data['message'] = 'session data';

        if (!empty($_COOKIE['studentemail']) && !empty($_COOKIE['studentid'])) {
            $data['status'] = 1;
            $data['results']['id'] = $_COOKIE['studentid'];
            $data['results']['email'] = $_COOKIE['studentemail'];
        } else {
            $data['status'] = 0;
        }
        break;
    case 'categories':

        $results = $database->select('quiz_categories', [
            'name',
            'id'
                ], [
            'status' => 0
        ]);

        $data['status'] = 1;
        $data['message'] = 'categories';
        $data['results'] = $results;
        break;
    case 'list':

        $results = $database->select('quiz_forms', ["[>]quiz_categories" => ["category" => "id"]], [
            'quiz_forms.title',
            'quiz_forms.id',
            "quiz_categories.name"
                ], [
            'quiz_forms.status' => 1
        ]);

        $data['status'] = 1;
        $data['message'] = 'List';
        $data['results'] = $results;
        break;
    case 'add':

        $title = $params['title'];
        $form_json = $params['form_json'];

        $result = json_decode($params['form_json'], true);

        $database->insert('quiz_forms', ['title' => $title, 'form_json' => $form_json, 'code' => $result['code'], 'category' => $result['category']]);

        $formId = $database->id();

        foreach ($result['pages'] as $key => $section) {
            $database->insert('quiz_form_sections', ['name' => $section['name'], 'uid' => $section['id'], 'number' => $section['number'], 'form_id' => $formId]);

            $sectionId = $database->id();

            foreach ($section['elements'] as $key => $element) {

                if ($element['type'] == 'question') {

                    $question = $element['question'];
                    $database->insert('quiz_form_section_questions', ['text' => $question['text'], 'uid' => $question['id'], 'answer' => $question['answer'], 'type' => $question['type'], 'section_id' => $sectionId]);
                }
            }
        }

        $data['status'] = 1;
        $data['message'] = 'Form added successfully.';
        break;
    case 'fetch':

        $results = $database->select('quiz_forms', [
            'form_json',
            'id'
                ], [
            'id' => $params['id']
        ]);

        $data['status'] = 1;
        $data['message'] = 'Fetch';
        $data['results'] = $results;
        break;
    case 'edit':

        $title = $params['title'];
        $form_json = $params['form_json'];
        $formId = $params['id'];

        $result = json_decode($form_json, true);

        $code = isset($result['code']) ? $result['code'] : '';
        $category = isset($result['category']) ? $result['category'] : 0;

        $database->update('quiz_forms', ['title' => $title, 'form_json' => $form_json, 'code' => $code, 'category' => $category], ['id' => $formId]);

        foreach ($result['pages'] as $key => $section) {

            $sectionId = $database->get('quiz_form_sections', 'id', ['uid' => $section['id']]);

            if (!empty($sectionId)) {
                $database->update('quiz_form_sections', [ 'name' => $section['name'], 'number' => $section['number']], ['uid' => $section['id']]);
            } else {
                $database->insert('quiz_form_sections', ['name' => $section['name'], 'uid' => $section['id'], 'number' => $section['number'], 'form_id' => $formId]);
                $sectionId = $database->id();
            }


            foreach ($section['elements'] as $key => $element) {

                if ($element['type'] == 'question') {

                    $question = $element['question'];
                    $isQuestionExist = $database->has('quiz_form_section_questions', ['uid' => $question['id']]);
                    if ($isQuestionExist) {
                        $database->update('quiz_form_section_questions', ['text' => $question['text'], 'answer' => $question['answer'], 'type' => $question['type'], 'section_id' => $sectionId], ['uid' => $question['id']]);
                    } else {
                        $database->insert('quiz_form_section_questions', ['text' => $question['text'], 'uid' => $question['id'], 'answer' => $question['answer'], 'type' => $question['type'], 'section_id' => $sectionId]);
                    }
                }
            }
        }

        $data['status'] = 1;
        $data['message'] = 'Form updated successfully.';
        break;
    case 'delete':

        $data['status'] = 1;
        $data['message'] = 'Form deleted successfully.';
        break;
    case 'response':

        $userId = $params['userid'];
        $formId = $params['formid'];

        $sections = $params['data']['pages'];

        foreach ($sections as $key => $section) {

            $sectionId = $database->get('quiz_form_sections', 'id', ['uid' => $section['id']]);

            foreach ($section['elements'] as $key => $element) {

                if ($element['type'] == 'question') {

                    $question = $element['question'];
                    if (!isset($question['response'])) {
                        $response = '';
                    } else {
                        if ($question['type'] == 'text') {
                            $response = $question['response'];
                        } else if ($question['type'] == 'radio') {
                            $response = $question['response']['selectedAnswer']['value'];
                        }
                    }
                    $correct = 0;
                    if (strtolower($question['answer']) == strtolower($response)) {
                        $correct = 1;
                    }
                    $database->insert('quiz_user_reponse', [ 'user_id' => $userId, 'quid' => $question['id'], 'response' => $response, 'correct' => $correct, 'form_id' => $formId, 'section_id' => $sectionId]);
                }
            }
        }

        $data['status'] = 1;
        $data['message'] = 'Response saved successfully.';

        break;
    default:
        $data['status'] = 0;
        $data['message'] = 'Invalid action';
}

echo json_encode($data);
