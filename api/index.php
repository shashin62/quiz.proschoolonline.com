<?php
require 'config.php';

$params = json_decode(file_get_contents('php://input'), true);

$action = $params['action'];

if ($action == 'list') {

    $results = $database->select('quiz_forms', [
        'title',
        'id'
            ], [
        'status' => 1
    ]);

    $data['status'] = 1;
    $data['message'] = 'List';
    $data['results'] = $results;
} else if ($action == 'add') {

    $title = $params['title'];
    $form_json = $params['form_json'];

    $result = json_decode($params['form_json'], true);

//    echo "<pre>";
//    print_r($result);

    $database->insert('quiz_forms', ['title' => $title, 'form_json' => $form_json]);

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
} else if ($action == 'fetch') {

    $results = $database->select('quiz_forms', [
        'form_json',
        'id'
            ], [
        'id' => $params['id']
    ]);

    $data['status'] = 1;
    $data['message'] = 'Fetch';
    $data['results'] = $results;
} else if ($action == 'edit') {

    $title = $params['title'];
    $form_json = $params['form_json'];
    $formId = $params['id'];

    $result = json_decode($form_json, true);

    $database->update('quiz_forms', ['title' => $title, 'form_json' => $form_json], ['id' => $formId]);

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
} else if ($action == 'delete') {

    $data['status'] = 1;
    $data['message'] = 'Form deleted successfully.';
} else if ($action == 'response') {


//    echo "<pre>";
//    print_r($params['data']);
    $userId = $params['userid'];    
    $formId = $params['formid'];

    $sections = $params['data']['pages'];

    foreach ($sections as $key => $section) {

        $sectionId = $database->get('quiz_form_sections', 'id', ['uid' => $section['id']]);
        
        foreach ($section['elements'] as $key => $element) {
            
            if ($element['type'] == 'question') {

                $question = $element['question'];
                if(!isset($question['response'])){
                    $response = '';
                } else {
                    if($question['type']=='text'){
                        $response = $question['response'];
                    } else if($question['type']=='radio') {
                        $response = $question['response']['selectedAnswer']['value'];
                    }
                }
                $correct = 0;
                if (strtolower($question['answer']) == strtolower($response)) {
                    $correct = 1;
                }
                $database->insert('quiz_user_reponse', [ 'user_id' => $userId, 'quid' => $question['id'], 'response' => $response, 'correct' => $correct, 'form_id'=> $formId,'section_id'=>$sectionId]);
            }
        }
    }


    $data['status'] = 1;
    $data['message'] = 'Response saved successfully.';
}

echo json_encode($data);

