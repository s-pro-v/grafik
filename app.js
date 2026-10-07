try {
    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
    ];

    let currentDate = new Date();
    let events = {};
    let selectedDate = null;
    let chartMode = 'year'; // 'year' | 'month'

    // GitHub Repository Configuration
    const GITHUB_USER = 's-pro-v';
    const GITHUB_REPO = 'json-lista';
    const URL_MAIN = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/grafik.json`;
    const URL_MASTER = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/master/grafik.json`;
    const DEFAULT_GRAFIK_URL = URL_MAIN;

    const URL_NORMA_MAIN = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/norma.json`;
    const URL_NORMA_MASTER = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/master/norma.json`;
    const DEFAULT_NORMA_URL = URL_NORMA_MAIN;

    // Built-in Default 12H Normative Model (2008h total for 2026)
    const DEFAULT_NORMA_DATA = {
        "system": "12h",
        "rok": 2026,
        "podsumowanie_roczne": {
            "godziny": 2008,
            "dni_pracy_8h": 251,
            "dni_wolne_8h": 114,
            "pelne_zmiany_12h": 167,
            "godziny_resztowe": 4,
            "dni_pracy_12h": 173,
            "dni_wolne_12h": 192
        },
        "miesiace": {
            "0": { "nazwa": "Styczeń", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 11, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 17 },
            "1": { "nazwa": "Luty", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 8, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 14 },
            "2": { "nazwa": "Marzec", "godziny": 176, "dni_pracy_8h": 22, "dni_wolne_8h": 9, "pelne_12h": 14, "reszta_h": 8, "dni_pracy_12h": 15, "dni_wolne_12h": 16 },
            "3": { "nazwa": "Kwiecień", "godziny": 168, "dni_pracy_8h": 21, "dni_wolne_8h": 9, "pelne_12h": 14, "reszta_h": 0, "dni_pracy_12h": 14, "dni_wolne_12h": 16 },
            "4": { "nazwa": "Maj", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 11, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 17 },
            "5": { "nazwa": "Czerwiec", "godziny": 168, "dni_pracy_8h": 21, "dni_wolne_8h": 9, "pelne_12h": 14, "reszta_h": 0, "dni_pracy_12h": 14, "dni_wolne_12h": 16 },
            "6": { "nazwa": "Lipiec", "godziny": 184, "dni_pracy_8h": 23, "dni_wolne_8h": 8, "pelne_12h": 15, "reszta_h": 4, "dni_pracy_12h": 16, "dni_wolne_12h": 15 },
            "7": { "nazwa": "Sierpień", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 11, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 17 },
            "8": { "nazwa": "Wrzesień", "godziny": 176, "dni_pracy_8h": 22, "dni_wolne_8h": 8, "pelne_12h": 14, "reszta_h": 8, "dni_pracy_12h": 15, "dni_wolne_12h": 15 },
            "9": { "nazwa": "Październik", "godziny": 176, "dni_pracy_8h": 22, "dni_wolne_8h": 9, "pelne_12h": 14, "reszta_h": 8, "dni_pracy_12h": 15, "dni_wolne_12h": 16 },
            "10": { "nazwa": "Listopad", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 10, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 16 },
            "11": { "nazwa": "Grudzień", "godziny": 160, "dni_pracy_8h": 20, "dni_wolne_8h": 11, "pelne_12h": 13, "reszta_h": 4, "dni_pracy_12h": 14, "dni_wolne_12h": 17 }
        }
    };

    let normaData = JSON.parse(JSON.stringify(DEFAULT_NORMA_DATA));

    // App Settings Configuration
    let appSettings = {
        firstDayOfWeek: "monday",
        workHours: 12,
        highlightWeekends: true,
        grafikUrl: DEFAULT_GRAFIK_URL,
        normaUrl: DEFAULT_NORMA_URL,
    };

    const publicHolidays = {
        2024: [
            "2024-0-1", "2024-0-6", "2024-2-31", "2024-3-1", "2024-4-1", "2024-4-3",
            "2024-4-19", "2024-4-30", "2024-7-15", "2024-10-1", "2024-10-11", "2024-11-25", "2024-11-26"
        ],
        2025: [
            "2025-0-1", "2025-0-6", "2025-3-20", "2025-3-21", "2025-4-1", "2025-4-3",
            "2025-5-8", "2025-5-19", "2025-7-15", "2025-10-1", "2025-10-11", "2025-11-24", "2025-11-25", "2025-11-26"
        ],
        2026: [
            "2026-0-1", "2026-0-6", "2026-3-5", "2026-3-6", "2026-4-1", "2026-4-3",
            "2026-4-24", "2026-5-4", "2026-7-15", "2026-10-1", "2026-10-11", "2026-11-24", "2026-11-25", "2026-11-26"
        ],
    };

    function logTelemetry(tag, message, color = 'var(--text-color)') {
        const logBox = document.getElementById("logBox");
        if (!logBox) return;
        const now = new Date();
        const ts = now.toTimeString().split(' ')[0];
        const row = document.createElement("div");
        row.className = "log-row";
        row.innerHTML = `<span class="log-ts">[${ts}] [${tag}]</span><span style="color: ${color}">${message}</span>`;
        logBox.appendChild(row);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function clearTelemetryLog() {
        const logBox = document.getElementById("logBox");
        if (logBox) {
            logBox.innerHTML = '';
            logTelemetry("SYS", "Dziennik zdarzeń wyczyszczony.");
        }
    }

    function showNotification(message, isError = false) {
        const notification = document.getElementById("notification");
        if (notification) {
            notification.textContent = message;
            notification.classList.toggle("error", isError);
            notification.classList.add("show");
            setTimeout(() => {
                notification.classList.remove("show");
            }, 3200);
        }
    }

    function sanitizeUrl(url) {
        try {
            if (!url) return '';
            const u = new URL(url);
            if (u.hostname === 'github.com' && u.pathname.includes('/blob/')) {
                u.hostname = 'raw.githubusercontent.com';
                u.pathname = u.pathname.replace('/blob/', '/');
            }
            if (u.hostname === 'gist.github.com') {
                u.hostname = 'gist.githubusercontent.com';
            }
            return u.toString();
        } catch (e) {
            return url;
        }
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("visible");
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("visible");
    }

    function openEventModal(dateStr) {
        selectedDate = dateStr;
        const [year, month, day] = dateStr.split("-").map(Number);
        const modalDateEl = document.getElementById("modal-date");
        if (modalDateEl) {
            modalDateEl.textContent = `Data: ${day} ${monthNames[month]} ${year}`;
        }
        const eventTextEl = document.getElementById("event-text");
        if (eventTextEl) {
            eventTextEl.value = "";
            setTimeout(() => eventTextEl.focus(), 60);
        }
        openModal("event-modal");
    }

    function quickAddPrompt(preset) {
        const todayStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        selectedDate = todayStr;
        selectQuickOption(preset);
        logTelemetry("QUICK_ADD", `Dodano szybki stempel: ${preset} dla ${todayStr}`, "var(--highlight-color)");
    }

    function selectQuickOption(option) {
        const el = document.getElementById("event-text");
        if (el) el.value = option;
        saveEvent();
    }

    function saveEvent() {
        const el = document.getElementById("event-text");
        if (!el) return;
        const eventText = el.value.trim();

        if (eventText && selectedDate) {
            if (!events[selectedDate]) events[selectedDate] = [];
            if (!events[selectedDate].includes(eventText)) {
                events[selectedDate].push(eventText);
                logTelemetry("EVENT_SAVED", `Zapisano: "${eventText}" (${selectedDate})`, "var(--highlight-color)");
            }
            saveEventsToLocalStorage();
            render();
            closeModal("event-modal");
            showNotification(`Zapisano: ${eventText}`);
        }
    }

    function confirmDeleteEvent(dateStr, eventText) {
        const message = document.getElementById("confirmation-message");
        const confirmBtn = document.getElementById("confirm-delete-btn");
        const cancelBtn = document.getElementById("confirm-cancel-btn");

        if (message) {
            message.textContent = `Czy na pewno usunąć wpis "${eventText}" z dnia ${dateStr}?`;
        }

        const deleteHandler = () => {
            if (events[dateStr] && eventText) {
                const eventIndex = events[dateStr].indexOf(eventText);
                if (eventIndex > -1) {
                    events[dateStr].splice(eventIndex, 1);
                }
                if (events[dateStr].length === 0) {
                    delete events[dateStr];
                }
                saveEventsToLocalStorage();
                render();
                logTelemetry("EVENT_DEL", `Usunięto wpis: "${eventText}" (${dateStr})`, "var(--hazard-red)");
                showNotification(`Usunięto: ${eventText}`);
            }
            closeModal("confirmation-modal");
            if (confirmBtn) confirmBtn.removeEventListener("click", deleteHandler);
        };

        if (confirmBtn) {
            confirmBtn.addEventListener("click", deleteHandler, { once: true });
        }
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                closeModal("confirmation-modal");
                if (confirmBtn) confirmBtn.removeEventListener("click", deleteHandler);
            };
        }
        openModal("confirmation-modal");
    }

    function saveEventsToLocalStorage() {
        localStorage.setItem("calendarEvents", JSON.stringify(events));
    }

    function loadEventsFromLocalStorage() {
        const savedEvents = localStorage.getItem("calendarEvents");
        if (savedEvents) {
            try {
                events = JSON.parse(savedEvents);
            } catch (e) {
                events = {};
            }
        }
    }

    function saveSettingsToLocalStorage() {
        localStorage.setItem("calendarSettings", JSON.stringify(appSettings));
    }

    function loadSettingsFromLocalStorage() {
        const savedSettings = localStorage.getItem("calendarSettings");
        if (savedSettings) {
            try {
                appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
            } catch (e) { }
        }
    }

    function saveNormaToLocalStorage() {
        localStorage.setItem("calendarNormaData", JSON.stringify(normaData));
    }

    function loadNormaFromLocalStorage() {
        const savedNorma = localStorage.getItem("calendarNormaData");
        if (savedNorma) {
            try {
                const parsed = JSON.parse(savedNorma);
                if (parsed && (parsed.miesiace || Array.isArray(parsed))) {
                    normaData = normalizeNormaData(parsed);
                }
            } catch (e) { }
        }
    }

    function normalizeNormaData(input) {
        if (input.miesiace && typeof input.miesiace === "object") {
            return input;
        }
        if (Array.isArray(input)) {
            const dict = {};
            input.forEach((item, idx) => {
                const key = item.miesiac !== undefined ? String(item.miesiac) : String(idx);
                dict[key] = item;
            });
            return { system: "12h", rok: new Date().getFullYear(), miesiace: dict };
        }
        return DEFAULT_NORMA_DATA;
    }

    function mergeCalendarData(incomingData) {
        let changed = false;
        for (const [date, list] of Object.entries(incomingData)) {
            if (!events[date]) {
                events[date] = [];
            }
            if (Array.isArray(list)) {
                list.forEach(item => {
                    if (!events[date].includes(item)) {
                        events[date].push(item);
                        changed = true;
                    }
                });
            }
        }
        return changed;
    }

    async function loadNormaFromUrl() {
        const url = appSettings.normaUrl || DEFAULT_NORMA_URL;
        logTelemetry("NORMA_SYNC", `Pobieranie norma.json z: ${url}`);
        showNotification("Pobieranie pliku norma.json...");

        try {
            let response = await fetch(url);
            if (!response.ok && url === DEFAULT_NORMA_URL) {
                logTelemetry("NORMA_WARN", `Błąd pobierania main (${response.status}). Próba master...`, "var(--highlight-color)");
                response = await fetch(URL_NORMA_MASTER);
            }
            if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
            const data = await response.json();
            normaData = normalizeNormaData(data);
            saveNormaToLocalStorage();
            render();
            logTelemetry("NORMA_OK", "Plik norma.json pobrany i zastosowany w telemetrii!", "var(--led-green)");
            showNotification("Norma 12h załadowana pomyślnie!");
        } catch (err) {
            logTelemetry("NORMA_ERR", `Błąd pobierania norma.json: ${err.message}`, "var(--hazard-red)");
            showNotification("Błąd pobierania norma.json (użyto pamięci lokalnej)", true);
        }
    }

    function loadDataFromUrl() {
        const syncLed = document.getElementById("syncLed");
        if (syncLed) syncLed.className = "led-indicator led-active";

        let useFallbackLogic = false;
        if (!appSettings.grafikUrl || appSettings.grafikUrl === DEFAULT_GRAFIK_URL || appSettings.grafikUrl.includes(GITHUB_REPO)) {
            useFallbackLogic = true;
        }

        if (!useFallbackLogic) {
            fetchSimpleUrl(appSettings.grafikUrl);
            return;
        }

        logTelemetry("SYNC", `Rozpoczęto pobieranie z gałęzi main: ${URL_MAIN}`);
        showNotification("Pobieranie grafiku online...");

        fetch(URL_MAIN)
            .then(res => {
                if (res.ok) return res.json();
                logTelemetry("WARN", `Błąd pobierania main (${res.status}). Próba master: ${URL_MASTER}`, "var(--highlight-color)");
                return fetch(URL_MASTER).then(resMaster => {
                    if (!resMaster.ok) {
                        throw new Error(`Błąd w gałęziach main i master (Status: ${resMaster.status})`);
                    }
                    return resMaster.json();
                });
            })
            .then(data => {
                if (typeof data === "object" && data !== null) {
                    mergeCalendarData(data);
                    saveEventsToLocalStorage();
                    render();
                    if (syncLed) syncLed.className = "led-indicator led-green";
                    logTelemetry("SYNC_OK", "Zdalny grafik załadowany i scalony pomyślnie!", "var(--led-green)");
                    showNotification("Grafik online załadowany pomyślnie!");
                } else {
                    throw new Error("Nieprawidłowy format JSON grafiku");
                }
            })
            .catch(error => {
                if (syncLed) syncLed.className = "led-indicator";
                logTelemetry("SYNC_ERR", error.message, "var(--hazard-red)");
                showNotification("Błąd pobierania grafiku", true);
            });
    }

    async function fetchSimpleUrl(url) {
        const syncLed = document.getElementById("syncLed");
        try {
            showNotification("Pobieranie grafiku z adresu...");
            logTelemetry("SYNC", `Pobieranie z URL: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
            const data = await response.json();
            if (typeof data === "object" && data !== null) {
                mergeCalendarData(data);
                saveEventsToLocalStorage();
                render();
                if (syncLed) syncLed.className = "led-indicator led-green";
                logTelemetry("SYNC_OK", "Pobrano z niestandardowego URL!", "var(--led-green)");
                showNotification("Grafik online zaktualizowany!");
            } else {
                throw new Error("Nieprawidłowy format danych");
            }
        } catch (error) {
            if (syncLed) syncLed.className = "led-indicator";
            logTelemetry("SYNC_ERR", error.message, "var(--hazard-red)");
            showNotification("Nie udało się pobrać grafiku.", true);
        }
    }

    async function syncAllRemoteData() {
        const syncLed = document.getElementById("syncLed");
        if (syncLed) syncLed.className = "led-indicator led-active";
        loadDataFromUrl();
        await loadNormaFromUrl();
    }

    function openSettingsModal() {
        const firstDaySelect = document.getElementById("first-day-select");
        if (firstDaySelect) firstDaySelect.value = appSettings.firstDayOfWeek;

        const workHoursInput = document.getElementById("work-hours-input");
        if (workHoursInput) workHoursInput.value = appSettings.workHours;

        const highlightWeekends = document.getElementById("highlight-weekends");
        if (highlightWeekends) highlightWeekends.checked = appSettings.highlightWeekends;

        const grafikUrlInput = document.getElementById("grafik-url-input");
        if (grafikUrlInput) grafikUrlInput.value = appSettings.grafikUrl || DEFAULT_GRAFIK_URL;

        const normaUrlInput = document.getElementById("norma-url-input");
        if (normaUrlInput) normaUrlInput.value = appSettings.normaUrl || DEFAULT_NORMA_URL;

        openModal("settings-modal");
    }

    function changeFirstDay(val) {
        appSettings.firstDayOfWeek = val;
        saveSettingsToLocalStorage();
        render();
        logTelemetry("CONFIG", `Pierwszy dzień tygodnia zmieniony na: ${val}`);
        showNotification("Zmieniono pierwszy dzień tygodnia");
    }

    function changeWorkHours(val) {
        const num = parseInt(val, 10);
        if (num >= 1 && num <= 24) {
            appSettings.workHours = num;
            saveSettingsToLocalStorage();
            render();
            logTelemetry("CONFIG", `Nominalny czas zmiany ustawiony na: ${num}h`);
            showNotification(`Ustawiono czas pracy: ${num}h`);
        }
    }

    function changeGrafikUrl(val) {
        const clean = sanitizeUrl(val.trim());
        if (clean) {
            appSettings.grafikUrl = clean;
            saveSettingsToLocalStorage();
            logTelemetry("CONFIG", `URL grafiku zaktualizowany: ${clean}`);
            showNotification("Zapisano adres URL grafiku");
        }
    }

    function resetGrafikUrl() {
        appSettings.grafikUrl = DEFAULT_GRAFIK_URL;
        const input = document.getElementById("grafik-url-input");
        if (input) input.value = DEFAULT_GRAFIK_URL;
        saveSettingsToLocalStorage();
        logTelemetry("CONFIG", "Przywrócono domyślny URL grafiku");
        showNotification("Przywrócono domyślny URL");
    }

    function changeNormaUrl(val) {
        const clean = sanitizeUrl(val.trim());
        if (clean) {
            appSettings.normaUrl = clean;
            saveSettingsToLocalStorage();
            logTelemetry("CONFIG", `URL normy zaktualizowany: ${clean}`);
            showNotification("Zapisano adres URL normy");
        }
    }

    function resetNormaUrl() {
        appSettings.normaUrl = DEFAULT_NORMA_URL;
        const input = document.getElementById("norma-url-input");
        if (input) input.value = DEFAULT_NORMA_URL;
        saveSettingsToLocalStorage();
        logTelemetry("CONFIG", "Przywrócono domyślny URL norma.json");
        showNotification("Przywrócono domyślny URL norma.json");
    }

    function toggleHighlightWeekends(highlight) {
        appSettings.highlightWeekends = highlight;
        saveSettingsToLocalStorage();
        render();
        logTelemetry("CONFIG", `Wyróżnienie weekendów: ${highlight ? 'WŁ' : 'WYŁ'}`);
        showNotification(highlight ? "Weekendy są wyróżnione" : "Wyróżnienie weekendów wyłączone");
    }

    function exportNormaJson() {
        const dataStr = JSON.stringify(normaData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `norma.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        logTelemetry("EXPORT", "Wyeksportowano bieżący plik norma.json.");
        showNotification("Plik norma.json wyeksportowany");
    }

    function importNormaJson() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                try {
                    const imported = JSON.parse(evt.target.result);
                    if (typeof imported === "object" && imported !== null) {
                        normaData = normalizeNormaData(imported);
                        saveNormaToLocalStorage();
                        render();
                        logTelemetry("IMPORT", "Pomyślnie zaimportowano plik norma.json!", "var(--led-green)");
                        showNotification("Zaktualizowano dane normy!");
                    } else {
                        throw new Error("Nieprawidłowa struktura JSON");
                    }
                } catch (err) {
                    logTelemetry("ERR", "Błąd importu pliku norma.json", "var(--hazard-red)");
                    showNotification("Błąd importu pliku norma.json", true);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function clearAllData() {
        const message = document.getElementById("confirmation-message");
        const confirmBtn = document.getElementById("confirm-delete-btn");
        const cancelBtn = document.getElementById("confirm-cancel-btn");

        if (message) {
            message.textContent = "UWAGA: Czy na pewno chcesz wyczyścić wszystkie wpisy kalendarza? Operacji nie można cofnąć.";
        }

        const clearHandler = () => {
            events = {};
            saveEventsToLocalStorage();
            render();
            closeModal("confirmation-modal");
            closeModal("settings-modal");
            logTelemetry("PURGE", "Wszystkie wpisy zostały usunięte!", "var(--hazard-red)");
            showNotification("Wszystkie dane usunięte!");
            if (confirmBtn) confirmBtn.removeEventListener("click", clearHandler);
        };

        if (confirmBtn) {
            confirmBtn.addEventListener("click", clearHandler, { once: true });
        }
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                closeModal("confirmation-modal");
                if (confirmBtn) confirmBtn.removeEventListener("click", clearHandler);
            };
        }
        openModal("confirmation-modal");
    }

    function exportData() {
        const dataStr = JSON.stringify(events, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `grafik-pracy-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        logTelemetry("EXPORT", "Wyeksportowano plik JSON ze zmianami.");
        showNotification("Dane wyeksportowane do pliku JSON");
    }

    function importData() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                try {
                    const imported = JSON.parse(evt.target.result);
                    if (typeof imported === "object" && imported !== null) {
                        events = imported;
                        saveEventsToLocalStorage();
                        render();
                        logTelemetry("IMPORT", `Pomyślnie zaimportowano ${Object.keys(events).length} dat.`, "var(--led-green)");
                        showNotification("Pomyślnie zaimportowano plik grafiku!");
                    } else {
                        throw new Error("Nieprawidłowa struktura JSON");
                    }
                } catch (err) {
                    logTelemetry("ERR", "Błąd importu pliku JSON", "var(--hazard-red)");
                    showNotification("Błąd podczas importu pliku JSON", true);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function isPublicHoliday(year, month, day) {
        const holidays = publicHolidays[year];
        if (!holidays) return false;
        const dateKey = `${year}-${month}-${day}`;
        return holidays.includes(dateKey);
    }

    function calculateWorkingDaysInMonth(year, month) {
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        let workingDays = 0;
        let holidays = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                if (isPublicHoliday(year, month, day)) {
                    holidays++;
                } else {
                    workingDays++;
                }
            }
        }
        return { workingDays, holidays };
    }

    function calculateSummary() {
        const summaryContent = document.getElementById("summary-content");
        const workHoursBadge = document.getElementById("work-hours-badge");
        if (workHoursBadge) {
            workHoursBadge.textContent = `NORMA 12H (NORMA.JSON)`;
        }
        if (!summaryContent) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        let nocki = 0, dniowki = 0, nadgodziny = 0, urlopy = 0;

        for (const dateStr in events) {
            const [eventYear, eventMonth] = dateStr.split("-").map(Number);
            if (eventYear === year && eventMonth === month) {
                events[dateStr].forEach((eventText) => {
                    switch (eventText.toLowerCase()) {
                        case "nocka": nocki++; break;
                        case "dniówka": dniowki++; break;
                        case "nadgodziny": nadgodziny++; break;
                        case "urlop": urlopy++; break;
                    }
                });
            }
        }

        const przepracowanoDni = nocki + dniowki + nadgodziny;
        const przepracowanoGodzin = przepracowanoDni * appSettings.workHours;

        // Fetch values from normaData or fallback to formula
        let normaGodzin = 0;
        let pelne12h = 0;
        let resztaGodzin = 0;
        let dniWolne12h = 0;
        let dniPracy8h = 0;

        const mKey = String(month);
        if (normaData && normaData.miesiace && normaData.miesiace[mKey]) {
            const mInfo = normaData.miesiace[mKey];
            normaGodzin = mInfo.godziny;
            pelne12h = mInfo.pelne_12h !== undefined ? mInfo.pelne_12h : Math.floor(normaGodzin / 12);
            resztaGodzin = mInfo.reszta_h !== undefined ? mInfo.reszta_h : (normaGodzin % 12);
            dniWolne12h = mInfo.dni_wolne_12h || 0;
            dniPracy8h = mInfo.dni_pracy_8h || Math.round(normaGodzin / 8);
        } else {
            const monthData = calculateWorkingDaysInMonth(year, month);
            normaGodzin = monthData.workingDays * 8;
            pelne12h = Math.floor(normaGodzin / 12);
            resztaGodzin = normaGodzin % 12;
            dniPracy8h = monthData.workingDays;
        }

        const roznicaGodzin = przepracowanoGodzin - normaGodzin;
        const diffClass = roznicaGodzin >= 0 ? "metric-positive" : "metric-negative";
        const roznicaZmian12h = przepracowanoDni - pelne12h;
        const diffDyzurowClass = roznicaZmian12h >= 0 ? "metric-positive" : "metric-negative";
        const procentNormy = normaGodzin > 0 ? Math.round((przepracowanoGodzin / normaGodzin) * 100) : 0;

        summaryContent.innerHTML = `
          <!-- SUMA GODZIN - GŁÓWNY PANEL TELEMETRII -->
          <div class="metric-cell metric-featured" style="grid-column: 1 / -1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="metric-label" style="color:var(--highlight-color); font-weight:800;">SUMA GODZIN (FAKT)</span>
              <span class="metric-sub" style="margin:0; font-size:0.68rem; color:var(--text-color); font-weight:800;">${procentNormy}% REALIZACJI</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:0.15rem;">
              <span class="metric-val metric-highlight" style="font-size:1.6rem; line-height:1;">${przepracowanoGodzin}h</span>
              <span class="metric-sub" style="font-size:0.75rem;">z planowanych ${normaGodzin}h</span>
            </div>
            <div style="margin-top:0.35rem; height:4px; background:var(--border-color); overflow:hidden; position:relative;">
              <div style="width:${Math.min(procentNormy, 100)}%; height:100%; background:${przepracowanoGodzin >= normaGodzin ? 'var(--led-green)' : 'var(--highlight-color)'};"></div>
            </div>
          </div>

          <div class="metric-cell">
            <span class="metric-label">Nocek (12h)</span>
            <span class="metric-val">${nocki}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Dniówek (12h)</span>
            <span class="metric-val">${dniowki}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Nadgodzin</span>
            <span class="metric-val">${nadgodziny}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Urlopów</span>
            <span class="metric-val">${urlopy}</span>
          </div>

          <div class="metric-divider"></div>

          <div class="metric-cell">
            <span class="metric-label">Dyżury 12h (Fakt)</span>
            <span class="metric-val">${przepracowanoDni}</span>
            <span class="metric-sub">${przepracowanoGodzin}h przeprac.</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Cel normy 12h</span>
            <span class="metric-val metric-highlight">${pelne12h} zm.</span>
            <span class="metric-sub">${resztaGodzin > 0 ? `+${resztaGodzin}h dopełnienia` : 'Równo 0h reszty'}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Bilans zmian 12h</span>
            <span class="metric-val ${diffDyzurowClass}">${roznicaZmian12h >= 0 ? '+' : ''}${roznicaZmian12h} zm.</span>
            <span class="metric-sub">względem pełnych 12h</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Wolne w syst. 12h</span>
            <span class="metric-val metric-positive">${dniWolne12h || '--'} dni</span>
            <span class="metric-sub">wg matrycy normy</span>
          </div>

          <div class="metric-divider"></div>

          <div class="metric-cell">
            <span class="metric-label">Norma z norma.json</span>
            <span class="metric-val metric-highlight">${normaGodzin}h</span>
            <span class="metric-sub">${dniPracy8h} dni w syst. 8h</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">Różnica godzinowa</span>
            <span class="metric-val ${diffClass}">${roznicaGodzin >= 0 ? '+' : ''}${roznicaGodzin}h</span>
            <span class="metric-sub">${roznicaGodzin >= 0 ? 'Nadpracowane' : 'Do przepracowania'}</span>
          </div>
        `;
    }

    function setChartMode(mode) {
        chartMode = mode;
        const yearBtn = document.getElementById("chartModeYearBtn");
        const monthBtn = document.getElementById("chartModeMonthBtn");
        if (yearBtn && monthBtn) {
            yearBtn.classList.toggle("pressed", mode === 'year');
            monthBtn.classList.toggle("pressed", mode === 'month');
        }
        renderTelemetryChart();
        logTelemetry("CHART", `Zmieniono widok wykresu na: ${mode === 'year' ? 'Roczny (12M)' : 'Miesięczny'}`);
    }

    function renderTelemetryChart() {
        const svg = document.getElementById("telemetryChart");
        const legend = document.getElementById("chartLegend");
        if (!svg) return;

        const currentYear = currentDate.getFullYear();
        const currentMonthIdx = currentDate.getMonth();

        // Compute monthly hours for the active year
        const monthlyWorkedHours = Array(12).fill(0);
        let currentMonthShifts = { nocka: 0, dniowka: 0, nadgodziny: 0, urlop: 0 };

        for (const dateStr in events) {
            const [evYear, evMonth] = dateStr.split("-").map(Number);
            if (evYear === currentYear) {
                events[dateStr].forEach((ev) => {
                    const lower = ev.toLowerCase();
                    if (lower === "nocka" || lower === "dniówka" || lower === "nadgodziny") {
                        monthlyWorkedHours[evMonth] += appSettings.workHours;
                    }
                    if (evMonth === currentMonthIdx) {
                        if (lower === "nocka") currentMonthShifts.nocka++;
                        else if (lower === "dniówka") currentMonthShifts.dniowka++;
                        else if (lower === "nadgodziny") currentMonthShifts.nadgodziny++;
                        else if (lower === "urlop") currentMonthShifts.urlop++;
                    }
                });
            }
        }

        if (chartMode === 'year') {
            if (legend) {
                legend.innerHTML = `
              <span class="legend-item"><span class="legend-box" style="background: var(--highlight-color);"></span> PRZEPRACOWANE</span>
              <span class="legend-item"><span class="legend-box" style="border-top: 2px dashed #888; background:transparent;"></span> NORMA (NORMA.JSON)</span>
            `;
            }

            const shortMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
            const maxVal = Math.max(220, ...monthlyWorkedHours, 200);
            const width = 360;
            const height = 160;
            const padL = 28;
            const padR = 10;
            const padT = 16;
            const padB = 22;
            const chartW = width - padL - padR;
            const chartH = height - padT - padB;
            const colW = chartW / 12;

            let svgHtml = `
            <!-- Gridlines -->
            <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="var(--border-color)" stroke-width="1" />
            <line x1="${padL}" y1="${padT + chartH * 0.5}" x2="${width - padR}" y2="${padT + chartH * 0.5}" stroke="var(--border-color)" stroke-width="1" />
            <line x1="${padL}" y1="${padT + chartH}" x2="${width - padR}" y2="${padT + chartH}" stroke="var(--border-color-hover)" stroke-width="1" />
            <text x="${padL - 4}" y="${padT + 4}" fill="var(--text-muted)" font-size="8" text-anchor="end" font-family="var(--font-family)">${maxVal}</text>
            <text x="${padL - 4}" y="${padT + chartH * 0.5 + 3}" fill="var(--text-muted)" font-size="8" text-anchor="end" font-family="var(--font-family)">${Math.round(maxVal / 2)}</text>
            <text x="${padL - 4}" y="${padT + chartH}" fill="var(--text-muted)" font-size="8" text-anchor="end" font-family="var(--font-family)">0</text>
          `;

            for (let m = 0; m < 12; m++) {
                const worked = monthlyWorkedHours[m];
                const mNorma = (normaData.miesiace && normaData.miesiace[String(m)]) ? normaData.miesiace[String(m)].godziny : 168;

                const barH = (worked / maxVal) * chartH;
                const normY = padT + chartH - (mNorma / maxVal) * chartH;
                const x = padL + m * colW + 4;
                const barW = Math.max(8, colW - 8);
                const y = padT + chartH - barH;

                const isCurrent = m === currentMonthIdx;
                const barColor = isCurrent ? "var(--highlight-color)" : (worked > 0 ? "#73380c" : "var(--border-color)");
                const borderStroke = isCurrent ? "var(--highlight-hover)" : "none";

                svgHtml += `
              <!-- Norma dash -->
              <line x1="${x - 2}" y1="${normY}" x2="${x + barW + 2}" y2="${normY}" stroke="${isCurrent ? '#ffffff' : '#888888'}" stroke-width="2" stroke-dasharray="2,2" />
              <!-- Bar -->
              <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(barH, 0)}" fill="${barColor}" stroke="${borderStroke}" stroke-width="1">
                <title>${monthNames[m]}: ${worked}h / ${mNorma}h</title>
              </rect>
              ${worked > 0 ? `<text x="${x + barW / 2}" y="${Math.max(y - 3, 10)}" fill="${isCurrent ? 'var(--highlight-color)' : 'var(--text-muted)'}" font-size="7.5" font-weight="700" text-anchor="middle" font-family="var(--font-family)">${worked}</text>` : ''}
              <!-- Month label -->
              <text x="${x + barW / 2}" y="${height - 6}" fill="${isCurrent ? 'var(--highlight-color)' : 'var(--text-muted)'}" font-weight="${isCurrent ? '800' : '400'}" font-size="8.5" text-anchor="middle" font-family="var(--font-family)">${shortMonths[m]}</text>
            `;
            }

            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.innerHTML = svgHtml;
        } else {
            // MONTH VIEW: Shifts Breakdown
            if (legend) {
                legend.innerHTML = `
              <span class="legend-item"><span class="legend-box" style="background: var(--shift-nocka);"></span> NOCKA</span>
              <span class="legend-item"><span class="legend-box" style="background: var(--shift-dniowka);"></span> DNIÓWKA</span>
              <span class="legend-item"><span class="legend-box" style="background: var(--shift-nadgodziny);"></span> NADG</span>
              <span class="legend-item"><span class="legend-box" style="background: var(--shift-urlop);"></span> URLOP</span>
            `;
            }

            const categories = [
                { label: "NOCKA", count: currentMonthShifts.nocka, color: "var(--shift-nocka)", hours: currentMonthShifts.nocka * appSettings.workHours },
                { label: "DNIÓWKA", count: currentMonthShifts.dniowka, color: "var(--shift-dniowka)", hours: currentMonthShifts.dniowka * appSettings.workHours },
                { label: "NADG", count: currentMonthShifts.nadgodziny, color: "var(--shift-nadgodziny)", hours: currentMonthShifts.nadgodziny * appSettings.workHours },
                { label: "URLOP", count: currentMonthShifts.urlop, color: "var(--shift-urlop)", hours: currentMonthShifts.urlop * 8 },
            ];

            const maxCount = Math.max(16, ...categories.map(c => c.count));
            const width = 360;
            const height = 160;
            const padL = 30;
            const padR = 20;
            const padT = 18;
            const rowH = 26;

            let svgHtml = `
            <text x="${padL}" y="12" fill="var(--text-muted)" font-size="8" font-weight="700" font-family="var(--font-family)">STRUKTURA ZMIAN // ${monthNames[currentMonthIdx].toUpperCase()} ${currentYear}</text>
          `;

            categories.forEach((cat, idx) => {
                const y = padT + idx * (rowH + 8);
                const barW = (cat.count / maxCount) * (width - padL - padR - 75);
                svgHtml += `
              <text x="${padL}" y="${y + 14}" fill="var(--text-muted)" font-size="8.5" font-weight="700" font-family="var(--font-family)">${cat.label}</text>
              <rect x="${padL + 55}" y="${y + 2}" width="${Math.max(barW, 2)}" height="16" fill="${cat.color}">
                <title>${cat.label}: ${cat.count} (${cat.hours}h)</title>
              </rect>
              <text x="${padL + 60 + barW}" y="${y + 14}" fill="var(--text-color)" font-size="9" font-weight="800" font-family="var(--font-family)">${cat.count} zm. <tspan fill="var(--text-muted)" font-size="8">(${cat.hours}h)</tspan></text>
            `;
            });

            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.innerHTML = svgHtml;
        }
    }

    function updateWeekdaysHeader() {
        const weekdaysGrid = document.querySelector(".weekdays-grid");
        if (!weekdaysGrid) return;
        if (appSettings.firstDayOfWeek === "monday") {
            weekdaysGrid.innerHTML = `
            <div>Pon</div><div>Wto</div><div>Śro</div><div>Czw</div><div>Pią</div><div style="color:var(--highlight-color)">Sob</div><div style="color:var(--hazard-red)">Nie</div>
          `;
        } else {
            weekdaysGrid.innerHTML = `
            <div style="color:var(--hazard-red)">Nie</div><div>Pon</div><div>Wto</div><div>Śro</div><div>Czw</div><div>Pią</div><div style="color:var(--highlight-color)">Sob</div>
          `;
        }
    }

    function createEventElement(text, dateStr) {
        const eventEl = document.createElement("div");
        eventEl.className = "event";

        let eventClass = "event-blue";
        switch (text.toLowerCase()) {
            case "nocka": eventClass = "event-gray"; break;
            case "dniówka": eventClass = "event-yellow"; break;
            case "nadgodziny": eventClass = "event-purple"; break;
            case "urlop": eventClass = "event-green"; break;
        }
        eventEl.classList.add(eventClass);

        const eventTextSpan = document.createElement("span");
        eventTextSpan.className = "event-text";
        eventTextSpan.textContent = text;
        eventEl.appendChild(eventTextSpan);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-event-btn";
        deleteBtn.innerHTML = "&times;";
        deleteBtn.title = "Usuń wpis";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            confirmDeleteEvent(dateStr, text);
        };
        eventEl.appendChild(deleteBtn);

        return eventEl;
    }

    function createDayCell(day, dateStr, isOtherMonth) {
        const dayCell = document.createElement("div");
        dayCell.className = `calendar-day ${isOtherMonth ? "other-month" : ""}`;
        dayCell.dataset.date = dateStr;

        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";

        const dayNumber = document.createElement("span");
        dayNumber.className = "day-number";
        dayNumber.textContent = day;

        const eventsContainer = document.createElement("div");
        eventsContainer.className = "events-container";

        const today = new Date();
        const [y, m, d] = dateStr.split("-").map(Number);
        const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d && !isOtherMonth;
        const isHoliday = !isOtherMonth && isPublicHoliday(y, m, d);

        if (isToday) {
            dayCell.classList.add("today");
            dayNumber.classList.add("today-indicator");
        }

        dayHeader.appendChild(dayNumber);

        if (isHoliday) {
            dayCell.classList.add("public-holiday");
            const hol = document.createElement("span");
            hol.className = "holiday-indicator";
            hol.textContent = "ŚWIĘTO";
            dayHeader.appendChild(hol);
        }

        dayCell.appendChild(dayHeader);
        dayCell.appendChild(eventsContainer);

        if (events[dateStr]) {
            events[dateStr].forEach((eventText) => {
                eventsContainer.appendChild(createEventElement(eventText, dateStr));
            });
        }

        if (!isOtherMonth) {
            dayCell.onclick = () => {
                openEventModal(dateStr);
            };
        }

        return dayCell;
    }

    function renderCalendarGrid() {
        const calendarGrid = document.getElementById("calendar-grid");
        const monthYear = document.getElementById("month-year");
        if (!calendarGrid || !monthYear) return;

        calendarGrid.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        let startDay = firstDayOfMonth.getDay();

        if (appSettings.firstDayOfWeek === "monday") {
            if (startDay === 0) startDay = 7;
            startDay--;
        }

        const prevMonthLastDay = new Date(year, month, 0);
        const prevMonthDays = prevMonthLastDay.getDate();
        for (let i = startDay; i > 0; i--) {
            const day = prevMonthDays - i + 1;
            const date = new Date(year, month - 1, day);
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            calendarGrid.appendChild(createDayCell(day, dateStr, true));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${month}-${i}`;
            calendarGrid.appendChild(createDayCell(i, dateStr, false));
        }

        const totalFilledCells = startDay + daysInMonth;
        const remainingCells = 42 - totalFilledCells;
        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            calendarGrid.appendChild(createDayCell(i, dateStr, true));
        }
    }

    function selectMonth(m) {
        currentDate.setMonth(m);
        render();
        logTelemetry("NAV", `Przełączono widok na: ${monthNames[m]} ${currentDate.getFullYear()}`);
    }

    function changeYearOffset(delta) {
        currentDate.setFullYear(currentDate.getFullYear() + delta);
        render();
        logTelemetry("NAV", `Przełączono rok na: ${currentDate.getFullYear()}`);
    }

    function renderYearTiles() {
        const grid = document.getElementById("year-tiles-grid");
        const yearBadge = document.getElementById("mini-tiles-year-badge");
        if (!grid) return;

        const currentYear = currentDate.getFullYear();
        const activeMonthIdx = currentDate.getMonth();
        const today = new Date();

        if (yearBadge) {
            yearBadge.textContent = `${currentYear}`;
        }

        const shortMonths = [
            "STY", "LUT", "MAR", "KWI", "MAJ", "CZE",
            "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"
        ];

        let html = "";
        for (let m = 0; m < 12; m++) {
            let nocki = 0, dniowki = 0, nadgodziny = 0, urlopy = 0;

            for (const dateStr in events) {
                const [evYear, evMonth] = dateStr.split("-").map(Number);
                if (evYear === currentYear && evMonth === m) {
                    events[dateStr].forEach((ev) => {
                        const lower = ev.toLowerCase();
                        if (lower === "nocka") nocki++;
                        else if (lower === "dniówka") dniowki++;
                        else if (lower === "nadgodziny") nadgodziny++;
                        else if (lower === "urlop") urlopy++;
                    });
                }
            }

            const totalShifts = nocki + dniowki + nadgodziny;
            const workedHours = totalShifts * appSettings.workHours;

            let mNorma = 168;
            if (normaData && normaData.miesiace && normaData.miesiace[String(m)]) {
                mNorma = normaData.miesiace[String(m)].godziny;
            } else {
                const md = calculateWorkingDaysInMonth(currentYear, m);
                mNorma = md.workingDays * 8;
            }

            const diff = workedHours - mNorma;
            const percent = mNorma > 0 ? Math.round((workedHours / mNorma) * 100) : 0;
            const isActive = (m === activeMonthIdx);
            const isTodayMonth = (today.getFullYear() === currentYear && today.getMonth() === m);

            let diffBadge = `<span class="yt-diff diff-empty">--</span>`;
            if (workedHours > 0) {
                if (diff >= 0) {
                    diffBadge = `<span class="yt-diff diff-pos">+${diff}h</span>`;
                } else {
                    diffBadge = `<span class="yt-diff diff-neg">${diff}h</span>`;
                }
            }

            let pills = "";
            if (totalShifts > 0 || urlopy > 0) {
                if (nocki > 0) pills += `<span class="yt-pill yt-pill-n" title="Nocka: ${nocki}">N:${nocki}</span>`;
                if (dniowki > 0) pills += `<span class="yt-pill yt-pill-d" title="Dniówka: ${dniowki}">D:${dniowki}</span>`;
                if (nadgodziny > 0) pills += `<span class="yt-pill yt-pill-nd" title="Nadgodziny: ${nadgodziny}">+${nadgodziny}</span>`;
                if (urlopy > 0) pills += `<span class="yt-pill yt-pill-u" title="Urlop: ${urlopy}">U:${urlopy}</span>`;
            } else {
                pills = `<span class="yt-no-shifts">BRAK WPISÓW</span>`;
            }

            let barColor = "transparent";
            if (workedHours >= mNorma && workedHours > 0) {
                barColor = "var(--led-green)";
            } else if (workedHours > 0) {
                barColor = "var(--highlight-color)";
            }

            let ledStatus = `<span class="led-indicator" style="opacity: 0.3;"></span>`;
            if (isActive) {
                ledStatus = `<span class="led-indicator led-active" title="Aktywny widok"></span>`;
            } else if (workedHours >= mNorma && workedHours > 0) {
                ledStatus = `<span class="led-indicator led-green" title="Norma wykonana (${percent}%)"></span>`;
            }

            const monthNumber = String(m + 1).padStart(2, '0');
            const tooltip = `${monthNames[m]} ${currentYear}&#10;Przepracowano: ${workedHours}h / ${mNorma}h (${percent}%)&#10;Nocki: ${nocki}, Dniówki: ${dniowki}, Nadgodziny: ${nadgodziny}, Urlop: ${urlopy}&#10;Kliknij, aby otworzyć ten miesiąc`;

            html += `
              <div class="year-tile ${isActive ? 'active' : ''} ${isTodayMonth ? 'is-today-month' : ''}" 
                   onclick="selectMonth(${m})" 
                   title="${tooltip}">
                <div class="yt-header">
                  <div class="yt-title">
                    <span class="yt-num">${monthNumber}</span>
                    <span class="yt-name">${shortMonths[m]}</span>
                    ${isTodayMonth ? '<span class="yt-badge-today">•</span>' : ''}
                  </div>
                  ${ledStatus}
                </div>
                <div class="yt-body">
                  <div class="yt-hours-wrap">
                    <span class="yt-hours">${workedHours}h</span>
                    <span class="yt-norm">/${mNorma}h</span>
                  </div>
                  ${diffBadge}
                </div>
                <div class="yt-pills">
                  ${pills}
                </div>
                <div class="yt-progress-track">
                  <div class="yt-progress-bar" style="width: ${Math.min(percent, 100)}%; background: ${barColor};"></div>
                </div>
              </div>
            `;
        }

        grid.innerHTML = html;
    }

    function render() {
        updateWeekdaysHeader();
        renderCalendarGrid();
        calculateSummary();
        renderTelemetryChart();
        renderYearTiles();
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
        logTelemetry("NAV", `Przeglądanie: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
        logTelemetry("NAV", `Przeglądanie: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
    }

    function goToToday() {
        currentDate = new Date();
        render();
        logTelemetry("NAV", "Powrót do bieżącego miesiąca.");
    }

    window.addEventListener("load", function () {
        loadSettingsFromLocalStorage();
        loadNormaFromLocalStorage();
        loadEventsFromLocalStorage();
        render();

        document.addEventListener("dragstart", (e) => { e.preventDefault(); return false; });
        document.addEventListener("drop", (e) => { e.preventDefault(); return false; });
        document.addEventListener("dragover", (e) => { e.preventDefault(); return false; });

        const eventTextInput = document.getElementById("event-text");
        if (eventTextInput) {
            eventTextInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") saveEvent();
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeModal("event-modal");
                closeModal("confirmation-modal");
                closeModal("settings-modal");
            }
        });

        document.querySelectorAll(".modal-overlay").forEach((modal) => {
            modal.onclick = function (e) {
                if (e.target === this) closeModal(this.id);
            };
        });

        syncAllRemoteData();
        logTelemetry("BOOT", "System gotowy. Zintegrowano obsługę norma.json i grafiku zdalnego.");
    });

    // Expose handlers globally
    window.prevMonth = prevMonth;
    window.nextMonth = nextMonth;
    window.goToToday = goToToday;
    window.openSettingsModal = openSettingsModal;
    window.importData = importData;
    window.loadDataFromUrl = loadDataFromUrl;
    window.loadNormaFromUrl = loadNormaFromUrl;
    window.syncAllRemoteData = syncAllRemoteData;
    window.exportData = exportData;
    window.exportNormaJson = exportNormaJson;
    window.importNormaJson = importNormaJson;
    window.selectQuickOption = selectQuickOption;
    window.closeModal = closeModal;
    window.saveEvent = saveEvent;
    window.changeFirstDay = changeFirstDay;
    window.changeWorkHours = changeWorkHours;
    window.toggleHighlightWeekends = toggleHighlightWeekends;
    window.changeGrafikUrl = changeGrafikUrl;
    window.resetGrafikUrl = resetGrafikUrl;
    window.changeNormaUrl = changeNormaUrl;
    window.resetNormaUrl = resetNormaUrl;
    window.clearAllData = clearAllData;
    window.clearTelemetryLog = clearTelemetryLog;
    window.setChartMode = setChartMode;
    window.renderTelemetryChart = renderTelemetryChart;
    window.selectMonth = selectMonth;
    window.changeYearOffset = changeYearOffset;
    window.renderYearTiles = renderYearTiles;
} catch (e) {
    console.error("JavaScript Error:", e);
}