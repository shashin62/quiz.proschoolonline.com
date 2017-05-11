<?php

 if(isset($_FILES['image'])){
      $errors= '';
      $file_name = $_FILES['image']['name'];
      $file_size =$_FILES['image']['size'];
      $file_tmp =$_FILES['image']['tmp_name'];
      $file_type=$_FILES['image']['type'];
      $file_ext=strtolower(end(explode('.',$_FILES['image']['name'])));
      
      $expensions= array("jpeg","jpg","png");
      
      if(in_array($file_ext,$expensions)=== false){
         $errors="extension not allowed, please choose a JPEG or PNG file.";
      }
      
      if($file_size > 2097152){
         $errors='File size must be excately 2 MB or less.';
      }
      
      if(empty($errors)==true){
         $new_filename = "image_".time()."_".  uniqid().".".$file_ext;
         move_uploaded_file($file_tmp,"images/".$new_filename);
         echo '{"status":1,"msg": "Image uploaded.", "src":"http://localhost/Shashin/ProSchool/Survey/quiz.proschoolonline.com/admin/images/'.$new_filename.'"}';
      }else{
         echo '{"status":0,"msg": "'.$errors.'"}';
      }
   }