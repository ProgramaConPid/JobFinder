// src/public/js/profileCompany.js
document.addEventListener("DOMContentLoaded", () => {
    // Detect if running on localhost or production
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const API_BASE = isLocalhost
        ? "http://localhost:5173"
        : "https://jobfinder-jdp5.onrender.com";

    const $ = (sel, root = document) => root.querySelector(sel);

    // Get company_id from URL or localStorage
    const getCompanyId = () => {
        const p = new URLSearchParams(window.location.search).get("company_id");
        if (p && /^\d+$/.test(p)) return Number(p);
        const ls = localStorage.getItem("company_id");
        if (ls && /^\d+$/.test(ls)) return Number(ls);
        return null;
    };

    const companyForm = $("#companyForm");
    if (!companyForm) return;

    // Refresh stats counters
    async function refreshStats() {
        const id = getCompanyId();
        if (!id) return;

        // Available Offers
        try {
            const res = await fetch(`${API_BASE}/api/offers?company_id=${id}`, {
                credentials: "include",
            });
            const offers = await res.json();
            $("#activeOffersCount").textContent = Array.isArray(offers) ? offers.length : 0;
        } catch (err) {
            console.error("[Stats] Error loading offers:", err);
            $("#activeOffersCount").textContent = "0";
        }

        // New Applicants
        try {
            const res = await fetch(`${API_BASE}/api/companies/${id}/new-applicants`, {
                credentials: "include",
            });
            const { total } = await res.json();
            $("#newApplicantsCount").textContent = Number(total) || 0;
        } catch (err) {
            console.error("[Stats] Error loading applicants:", err);
            $("#newApplicantsCount").textContent = "0";
        }
    }

    // Fill out the form with backend data
    const setFormValues = (data) => {
        const map = {
            name: "#companyName",
            industry: "#industry",
            website: "#website",
            company_size: "#employees",
            description: "#companyDescription",

            contact_person: "#contactName",
            contact_position: "#contactPosition",
            email: "#contactEmail",
            phone: "#contactPhone",
            address: "#address",

            linkedin: "#linkedin",
            twitter: "#twitter",
            facebook: "#facebook",
            instagram: "#instagram",
        };

        for (const [k, sel] of Object.entries(map)) {
            const input = $(sel);
            if (input) input.value = data?.[k] ?? "";
        }
    };

    const getFormValues = () => {
        const v = (sel) => ($(sel)?.value ?? "").trim();
        return {
            name: v("#companyName"),
            industry: v("#industry"),
            website: v("#website"),
            company_size: v("#employees"),
            description: v("#companyDescription"),

            contact_person: v("#contactName"),
            contact_position: v("#contactPosition"),
            email: v("#contactEmail"),
            phone: v("#contactPhone"),
            address: v("#address"),

            linkedin: v("#linkedin"),
            twitter: v("#twitter"),
            facebook: v("#facebook"),
            instagram: v("#instagram"),
        };
    };

    const id = getCompanyId();
    if (!id) return;

    // Load company profile
    (async () => {
        try {
            const r = await fetch(`${API_BASE}/api/companies/${id}`, {
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
                icon: "success",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error Load Profile!",
                text: "Profile could not be loaded",
                icon: "error",
            });
        }
    })();

    // Save Changes (PUT)
    companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const payload = getFormValues();
            const r = await fetch(`${API_BASE}/api/companies/${id}`, {
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
                icon: "success",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Update failed!",
                text: "Data could not be updated.",
                icon: "error",
            });
        }
    });

    // Cancel button → return to dashboard
    const cancelBtn = $("#cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "./dashboardCompany.html";
        });
    }
});
