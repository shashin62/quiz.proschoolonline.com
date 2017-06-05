<?php 
// If you installed via composer, just use this code to requrie autoloader on the top of your projects.
require 'vendor/autoload.php';
 
// Using Medoo namespace
use Medoo\Medoo;
 
// Initialize
$database = new Medoo([
    'database_type' => 'mysql',
    'database_name' => 'quiz',
    'server' => 'localhost',
    'username' => 'root',
    'password' => ''
]);

$params = json_decode(file_get_contents('php://input'),true);


$action = $params['action'];

if($action == 'list'){
    
    $results = $database->select('quiz_forms', [
        'title',
        'id'
            ], [
        'status' => 1
    ]);
    
    $data['status'] = 1;
    $data['message'] = 'List';
    $data['results'] = $results;
    
} else if($action == 'add'){
    
    $title = $params['title'];
    $form_json = $params['form_json'];
    $database->insert('quiz_forms', ['title' => $title,'form_json' => $form_json]);
    
    $data['status'] = 1;
    $data['message'] = 'Form added successfully.';
    
} else if($action == 'fetch'){
    
    $results = $database->select('quiz_forms', [
        'form_json',
        'id'
            ], [
                'id' => $params['id']
    ]);
    
    $data['status'] = 1;
    $data['message'] = 'Fetch';
    $data['results'] = $results;
    
} else if($action == 'edit'){
    
    $title = $params['title'];
    $form_json = $params['form_json'];
    $database->update('quiz_forms', ['title' => $title,'form_json' => $form_json], ['id'=> $params['id']]);
    
    $data['status'] = 1;
    $data['message'] = 'Form updated successfully.';
    
} else if($action == 'delete'){
    
    $data['status'] = 1;
    $data['message'] = 'Form deleted successfully.';
}

echo json_encode($data);

