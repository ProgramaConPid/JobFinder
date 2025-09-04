// src/public/js/profileCoder.js
document.addEventListener("DOMContentLoaded", () => {
    // Detect if running on localhost or production
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
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


    // Refresh stats counters
    async function refreshStats() {
        const id = getApplicantId();
        if (!id) return;

        // Applications Sent
        try {
            const res = await fetch(`${API_BASE}/api/applications?applicant_id=${id}`);
            const apps = await res.json();
            $("#applicationsSentCount").textContent = Array.isArray(apps) ? apps.length : 0;
        } catch (err) {
            console.error("[Stats] Error loading applications:", err);
            $("#applicationsSentCount").textContent = "0";
        }

        // Available offers
        try {
            const res = await fetch(`${API_BASE}/api/offers`);
            const offers = await res.json();
            $("#availableOffersCount").textContent = Array.isArray(offers) ? offers.length : 0;
        } catch (err) {
            console.error("[Stats] Error loading offers:", err);
            $("#availableOffersCount").textContent = "0";
        }

        // Scheduled interviews
        try {
            const res = await fetch(`${API_BASE}/api/applicants/${id}/interviews/count`);
            const { total } = await res.json();
            $("#scheduledInterviewsCount").textContent = Number(total) || 0;
        } catch (err) {
            console.error("[Stats] Error loading interviews:", err);
            $("#scheduledInterviewsCount").textContent = "0";
        }
    }

    // Fill out the form with the backend data
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

    // Take the values from the form to send them to the backend
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
        return;
    }

    // Load applicant profile from database
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
            refreshStats();
            Swal.fire({
                title: "Profile Loaded!",
                text: "Profile successfully loaded",
                icon: "success"
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error Load Profile!",
                text: "Profile could not be loaded",
                icon: "error"
            });
        }
    })();

    // Save Changes (PUT)
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
            Swal.fire({
                title: "Successful update!",
                text: "The data was updated correctly",
                icon: "success"
            });
            refreshStats(); // ⬅️ Refresh stats after update
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Update failed!",
                text: "Data could not be updated.",
                icon: "error"
            });
        }
    });

    // Cancel button → return to the dashboard
    const cancelBtn = $("#cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "./dashboardCoder.html";
        });
    }
});
