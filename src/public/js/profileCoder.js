// src/public/js/profileCoder.js
document.addEventListener("DOMContentLoaded", () => {
    // Detect if running on localhost or production
    const isLocalhost = ["localhost", "127.0.0.1"].includes(
        window.location.hostname
    );
    const API_BASE = isLocalhost
        ? "http://localhost:5173"
        : "https://jobfinder-jdp5.onrender.com";

    const $ = (sel, root = document) => root.querySelector(sel);

    // Get applicant_id from URL or localStorage
    const getApplicantId = () => {
        const p = new URLSearchParams(window.location.search).get("applicant_id");
        if (p && /^\d+$/.test(p)) return Number(p);
        const ls = localStorage.getItem("applicant_id");
        if (ls && /^\d+$/.test(ls)) return Number(ls);
        return null;
    };

    const profileForm = $("#profileForm");
    if (!profileForm) return;

    const msgEl = $("#profileMsg");

    const showMsg = (text, ok = true) => {
        if (!msgEl) return alert(text);
        msgEl.textContent = text;
        msgEl.className = ok ? "form-msg ok" : "form-msg error";
    };

    // 🔹 Fill out the form with the backend data
    const setFormValues = (data) => {
        const map = {
            first_name: "#firstName",
            last_name: "#lastName",
            email: "#email",
            phone: "#phone",
            address: "#address",
            profession: "#profession",
            years_experience: "#experience",
            education_level: "#education",
            skills: "#skills",
            resume_url: "#resume",
            linkedin: "#linkedin",
            twitter: "#twitter",
            facebook: "#facebook",
            instagram: "#instagram",
        };

        for (const [k, sel] of Object.entries(map)) {
            const input = $(sel);
            if (!input) continue;

            // Special handling for file inputs
            if (sel === "#resume" && data[k]) {
                const status = $("#resumeStatus span");
                if (status) status.textContent = "Resume uploaded ✅";
                continue;
            }

            input.value = data?.[k] ?? "";
        }
    };

    // 🔹 Take the values from the form to send them to the backend
    const getFormValues = () => {
        const v = (sel) => ($(sel)?.value ?? "").trim();
        return {
            first_name: v("#firstName"),
            last_name: v("#lastName"),
            phone: v("#phone"),
            address: v("#address"),
            profession: v("#profession"),
            years_experience: v("#experience"),
            education_level: v("#education"),
            skills: v("#skills"),
            resume_url: v("#resume"),
            linkedin: v("#linkedin"),
            twitter: v("#twitter"),
            facebook: v("#facebook"),
            instagram: v("#instagram"),
        };
    };

    const id = getApplicantId();
    if (!id) {
        showMsg("applicant_id not found. Please log in again.", false);
        return;
    }

    // 🔹 Load applicant profile from database
    (async () => {
        try {
            const r = await fetch(`${API_BASE}/api/coders/${id}`, {
                credentials: "include",
            });
            if (!r.ok) {
                const e = await r.json().catch(() => ({}));
                throw new Error(e.error || "Could not load profile");
            }
            const data = await r.json();
            setFormValues(data);
            showMsg("Profile loaded.");
        } catch (err) {
            console.error(err);
            showMsg(err.message, false);
        }
    })();

    // 🔹 Save Changes (PUT)
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const payload = getFormValues();
            const r = await fetch(`${API_BASE}/api/coders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!r.ok) {
                const e = await r.json().catch(() => ({}));
                throw new Error(e.error || "Could not save profile");
            }
            const updated = await r.json();
            setFormValues(updated);
            showMsg("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            showMsg(err.message, false);
        }
    });

    // 🔹 Cancel button → return to the dashboard
    const cancelBtn = $("#cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "./dashboardCoder.html";
        });
    }
});
