// Alert Controller
function showAlert(message, isSuccess = true) {
    const alert = document.getElementById('customAlert');
    const messageEl = document.getElementById('alertMessage');
    const closeBtn = document.getElementById('alertClose');

    // Set message and style
    messageEl.textContent = message;
    alert.className = `alert-modal ${isSuccess ? 'success' : 'error'}`;
    alert.style.display = 'flex';

    // Close handler
    closeBtn.onclick = () => {
        alert.style.display = 'none';
        if (isSuccess) window.location.href = "./login.html";
    };
}

const signupForm = document.getElementById("signupform");
const errorMessage = document.getElementById("errorMessage"); // Make sure this exists in HTML

signupForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    // Clear previous error styles
    document.getElementById("password").style.borderColor = "";
    document.getElementById("confirmpassword").style.borderColor = "";
    
    // Password match validation
    if (password !== confirmpassword) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmpassword").style.borderColor = "red";
        if (errorMessage) errorMessage.style.display = "block";
        return;
    } else {
        if (errorMessage) errorMessage.style.display = "none";
    }

    try {
        const response = await fetch("https://shoezamserver.onrender.com/signup", {  // Changed to 5000
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert("Signup successful! Click OK to continue.", true);
        } else {
            showAlert(data.message || "Signup failed", false);
        }
    } catch (error) {
        console.error("Signup error:", error);
        showAlert("Network error. Please try again.", false);
    }
});