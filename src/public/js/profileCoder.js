document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileForm = document.getElementById('profileForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const resumeInput = document.getElementById('resume');
    const resumeStatus = document.getElementById('resumeStatus');
    
    // Load profile data if available
    loadProfileData();
    
    // Event to change avatar
    changeAvatarBtn.addEventListener('click', function() {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                // Save to localStorage (in a real app, it would be sent to the server)
                localStorage.setItem('profileAvatar', e.target.result);
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Event to upload resume
    resumeInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                resumeStatus.innerHTML = `<span>Selected file: ${file.name}</span>`;
                // Save to localStorage (in a real app, it would be sent to the server)
                localStorage.setItem('resumeFile', file.name);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please upload a PDF file!',
                });
                resumeInput.value = '';
            }
        }
    });
    
    // Event to submit the form
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Get form data
            const formData = getFormData();
            
            // Save data (in a real app, it would be sent to the server)
            saveProfileData(formData);
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
    
    // Event to cancel
    cancelBtn.addEventListener('click', function() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Unsaved changes will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel',
            cancelButtonText: 'No, keep editing'
        }).then((result) => {
            if (result.isConfirmed) {
                // Go back to the previous page
                window.history.back();
            }
        });
    });
    
    // Function to validate the form
    function validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!firstName) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter your first name',
            });
            return false;
        }
        
        if (!lastName) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter your last name',
            });
            return false;
        }
        
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter your email',
            });
            return false;
        }
        
        if (!isValidEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid email',
            });
            return false;
        }
        
        return true;
    }
    
    // Function to validate email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Function to get form data
    function getFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            profession: document.getElementById('profession').value.trim(),
            experience: document.getElementById('experience').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value.trim()
        };
    }
    
    // Function to save profile data
    function saveProfileData(data) {
        // Save to localStorage (in a real app, it would be sent to the server)
        localStorage.setItem('profileData', JSON.stringify(data));
    }
    
    // Function to load profile data
    function loadProfileData() {
        const savedData = localStorage.getItem('profileData');
        const savedAvatar = localStorage.getItem('profileAvatar');
        const savedResume = localStorage.getItem('resumeFile');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Fill form with saved data
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('profession').value = data.profession || '';
            document.getElementById('experience').value = data.experience || '';
            document.getElementById('education').value = data.education || '';
            document.getElementById('skills').value = data.skills || '';
        }
        
        if (savedAvatar) {
            profileAvatar.src = savedAvatar;
        }
        
        if (savedResume) {
            resumeStatus.innerHTML = `<span>Uploaded file: ${savedResume}</span>`;
        }
    }
});
