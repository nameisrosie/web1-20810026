document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('formAccountRegistration');

    async function handleAccountRegistration(event) {
        event.preventDefault();
        const usernameInput = document.getElementById("signUpUsername");
        const emailInput = document.getElementById("signUpEmail");
        const passwordInput = document.getElementById("signUpPassword");
        const confirmPasswordInput = document.getElementById("signUpConfirmPassword");

        // Đảm bảo các trường input tồn tại trước khi truy cập giá trị của chúng
        if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error("One or more registration form input elements not found.");
            alert("Registration form error. Please contact support.");
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill out all schools.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password does not match. Please try again");
            if (passwordInput) passwordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';
            if (passwordInput) passwordInput.focus();
            return;
        }

        console.log("Simulation of account registration for:", { username, email });
        alert(`Account for ${username} has been successfully created! Now you can try to login.`);

        const modalElement = document.getElementById("modalSignUp");
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            modalElement.addEventListener('hidden.bs.modal', function () {
                if (usernameInput) usernameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (passwordInput) passwordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';
            }, { once: true });
        }
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleAccountRegistration);
    }
});