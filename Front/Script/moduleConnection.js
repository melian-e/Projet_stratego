function togglePassword(fieldId){
    const field = document.getElementById(fieldId);
    field.type = (field.type == "password") ? "text" : "password";
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
}

function autosubmit(){
    $('#connection').modal('show');
}