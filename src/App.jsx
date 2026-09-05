import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import {
  Check, Plus, X, Loader2, PenLine, BarChart3, Activity, Settings, Sparkles,
  RotateCcw, LogOut, Droplet, Scale, NotebookPen, Award, Quote, Save, Clock,
  CalendarDays, Pencil, Trash2, CheckCircle2, Globe, Bell, ChevronRight, Info,
  Dices, Circle, Target, ListChecks, Trophy, Dumbbell,
} from "lucide-react";

/* ============================================================================
   TOKENS
============================================================================ */

const C = {
  pink: "#f472b6",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#fb7185",
  text: "#eef0ff",
  muted: "#9aa0c3",
  glass: "rgba(255,255,255,0.045)",
  glassBorder: "rgba(255,255,255,0.12)",
};

const DEFAULT_THEME = { primary: "#8b5cf6", accent: "#22d3ee", background: "#0a0118", backgroundImage: "", backgroundImageTarget: "dashboard" };

const ELASTIC = "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
const SMOOTH = "cubic-bezier(0.22, 1, 0.36, 1)";

/* Emoji scale for the Mental State line chart Y-axis: index 0 = value 1 ... index 9 = value 10 */
const MOOD_EMOJIS = ["😭", "😢", "😞", "😐", "🙂", "😊", "😃", "😄", "🤩", "🥳"];

/* Quote of the day: auto-rotates every 10 minutes, or on manual "Next" click */
const QUOTE_ROTATE_MS = 10 * 60 * 1000;

/* ============================================================================
   TRANSLATIONS
============================================================================ */

const TR = {
  de: {
    monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
    monthShort: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
    weekdayLetters: ["Sa","So","Mo","Di","Mi","Do","Fr"],
    day: "Tag",
    week: "Woche",
    navEntry: "Eintragen",
    navStats: "Statistiken",
    navActivity: "Aktivitäten",
    navEvents: "Termine",
    navChallenges: "Challenges",
    navRoutines: "Routinen",
    navGoals: "Ziele",
    dashboardOf: (name) => `Dashboard von ${name}`,
    logout: "Abmelden",
    settings: "Einstellungen",
    primaryColor: "Hauptfarbe",
    accentColor: "Akzentfarbe",
    backgroundColor: "Hintergrundfarbe",
    language: "Sprache",
    reset: "Zurücksetzen",
    welcomeBack: "Willkommen zurück",
    loginSub: "Trag deinen Vornamen ein, um dein persönliches Dashboard zu öffnen.",
    firstNamePlaceholder: "Dein Vorname",
    pleaseEnterName: "Bitte gib einen Namen ein.",
    login: "Anmelden",
    calendar: "Kalender",
    myHabits: "Meine Habits",
    remove: "Entfernen",
    addHabit: "Habit hinzufügen",
    name: "Name",
    dailyProgress: "Tägliche Fortschritte",
    weeklyProgress: "Wöchentliche Fortschritte",
    monthlyProgress: "Monatliche Fortschritte",
    goal: "Ziel",
    done: "Erledigt",
    open: "Offen",
    analysisPerHabit: "Analyse pro Habit",
    habit: "Habit",
    actual: "Ist",
    percent: "%",
    mentalState: "Mentaler Zustand",
    mood: "Stimmung",
    motivation: "Motivation",
    top10: "Top 10 Habits",
    motivationTips: "Motivation & Tipps",
    topicPlaceholder: "z. B. schlechter Schultag, Stress, keine Motivation …",
    topicEmptyHint: "Tippe ein Thema ein – z. B. wie dein Tag war – und du bekommst passende Impulse.",
    quoteOfDay: "Zitat des Tages",
    nextQuote: "Nächstes",
    journal: "Notizen & Tagebuch",
    toToday: "Zu heute",
    journalPlaceholder: "Wie war dein Tag? Was ist dir aufgefallen?",
    journalTitlePlaceholder: "Titel des Eintrags (z. B. Mein erster Tag)",
    titleRequired: "Bitte gib einen Titel ein.",
    textRequired: "Bitte gib einen Text ein.",
    entryNotSaved: "Eintrag nicht dauerhaft gespeichert",
    unsavedChanges: "Ungespeicherte Änderungen",
    saved: "Gespeichert",
    save: "Speichern",
    earlierEntries: "Frühere Einträge",
    noSavedEntries: "Noch keine gespeicherten Einträge.",
    water: (day) => `Trinkwasser · ${day}`,
    glasses: "Gläsern",
    badges: "Abzeichen",
    streak: "Tage-Streak",
    storageWarning: (detail) => `⚠️ Dauerhaftes Speichern nicht möglich: ${detail}`,
    // events tab
    eventsTitle: "Termine & geplante Events",
    newEvent: "Neuer Termin",
    editEvent: "Termin bearbeiten",
    eventName: "Name",
    eventNamePlaceholder: "z. B. Zum Arzt, Training",
    eventDate: "Datum",
    eventTime: "Uhrzeit",
    eventDescription: "Beschreibung (optional)",
    eventDescriptionPlaceholder: "Details zum Termin …",
    saveEvent: "Speichern",
    cancel: "Abbrechen",
    upcoming: "Anstehend",
    past: "Erledigt",
    noEvents: "Noch keine Termine eingetragen.",
    edit: "Bearbeiten",
    delete: "Löschen",
    markDone: "Als erledigt markieren",
    markOpen: "Als offen markieren",
    autoCompleted: "automatisch erledigt",
    fillNameDate: "Bitte Name und Datum angeben.",
    eventSaved: "Termin gespeichert",
    eventDeleted: "Termin gelöscht",
    eventNotSaved: "Termin nicht dauerhaft gespeichert",
    // settings: background image
    backgroundImage: "Hintergrundbild",
    backgroundImageUrlPlaceholder: "Bild-URL einfügen …",
    uploadImage: "Bild hochladen",
    bgTargetDashboard: "Ganzes Dashboard",
    bgTargetJournal: "Nur Tagebuch",
    // water history
    waterHistory: "Verlauf",
    // food tracker
    foodTracker: "Healthy & Unhealthy Food Tracker",
    ateHealthy: "Gesund gegessen",
    ateUnhealthy: "Ungesund gegessen",
    healthy: "Gesund",
    unhealthy: "Ungesund",
    foodWarning: "Du hast diese Woche viele ungesunde Lebensmittel gegessen. Versuche morgen etwas Gesundes!",
    last7Days: "Letzte 7 Tage",
    // notifications
    notifications: "Benachrichtigungen",
    dueSoon: "⚠️ Bald fällig",
    completedBadge: "✅ Erledigt",
    noUpcomingEvents: "Keine anstehenden Termine.",
    // manifesto / about
    aboutInfoButton: "!",
    aboutTooltip: "Über dieses Projekt",
    aboutPopupTitle: "Danke, dass du hier bist",
    aboutPopupText: "Diese Website wird nie etwas kosten. Sie ist für jeden gedacht, der ein Stück mehr Struktur, Reflexion und Fortschritt in seinen Alltag bringen möchte – unabhängig davon, was er sich leisten kann. Wenn dir das Dashboard hilft, ist das schon genug.",
    closeButton: "Schließen",
    // challenge dice
    challengeTitle: "Challenge-Würfel",
    rollDice: "Würfeln",
    diffEasy: "Leicht",
    diffMedium: "Mittel",
    diffHard: "Hard",
    firstChallengeHint: "Würfle deine erste Challenge!",
    markDoneChallenge: "Als erledigt markieren",
    noChallengesYet: "Noch keine Challenges gewürfelt.",
    rolledLabel: "Gewürfelt",
    challengeHistoryTitle: "Verlauf",
    // routines
    routinesTitle: "Routinen",
    routinesSub: "Deine wiederkehrenden Trainingspläne",
    newRoutine: "Neue Routine",
    routineName: "Name",
    routineNamePlaceholder: "z. B. Push-Tag",
    routineDescription: "Beschreibung",
    routineDescriptionPlaceholder: "z. B. Alle Push-Übungen",
    routineDuration: "Dauer (Minuten)",
    routineGoal: "Ziel",
    routineGoalPlaceholder: "z. B. 3 Sätze pro Übung",
    routineCategory: "Kategorie",
    catStrength: "Kraft",
    catEndurance: "Ausdauer",
    catMobility: "Mobilität",
    saveRoutine: "Routine speichern",
    noRoutines: "Noch keine Routinen angelegt.",
    markRoutineDone: "Erledigt",
    markRoutineSkipped: "Übersprungen",
    routineDoneFeedback: ["Stark! Weiter so. 🔥", "Genau so bleibt man dran. 💪", "Ein Punkt mehr für dich. ⚡", "Sauber durchgezogen. 🚀"],
    routineSkippedFeedback: ["Kein Drama – morgen wieder angreifen.", "Kurze Pause, keine Ausrede.", "Notiert. Nächstes Mal zählt's wieder.", "Nicht ideal, aber kein Weltuntergang."],
    routineStreak: "Serie",
    todayStatus: "Heute",
    fillRoutineName: "Bitte gib einen Namen ein.",
    minutesShort: "Min",
    // goals
    goalsTitle: "Ziele",
    goalsSub: "Deine langfristigen Vorhaben",
    newGoal: "Neues Ziel",
    goalName: "Name",
    goalNamePlaceholder: "z. B. 10 kg abnehmen",
    goalDate: "Zieldatum",
    goalPeriod: "Zeitraum",
    goalPeriodPlaceholder: "z. B. 3 Monate",
    goalCategory: "Kategorie",
    catHealth: "Gesundheit",
    catFitness: "Fitness",
    catCareer: "Beruf",
    catLearning: "Lernen",
    saveGoal: "Ziel speichern",
    noGoals: "Noch keine Ziele eingetragen.",
    progress: "Fortschritt",
    goalAchieved: "Erreicht!",
    fillGoalName: "Bitte Name und Datum angeben.",
    deleteGoal: "Löschen",
  },
  en: {
    monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    weekdayLetters: ["Sa","Su","Mo","Tu","We","Th","Fr"],
    day: "Day",
    week: "Week",
    navEntry: "Track",
    navStats: "Stats",
    navActivity: "Activity",
    navEvents: "Events",
    navChallenges: "Challenges",
    navRoutines: "Routines",
    navGoals: "Goals",
    dashboardOf: (name) => `${name}'s Dashboard`,
    logout: "Log out",
    settings: "Settings",
    primaryColor: "Primary color",
    accentColor: "Accent color",
    backgroundColor: "Background color",
    language: "Language",
    reset: "Reset",
    welcomeBack: "Welcome back",
    loginSub: "Enter your first name to open your personal dashboard.",
    firstNamePlaceholder: "Your first name",
    pleaseEnterName: "Please enter a name.",
    login: "Log in",
    calendar: "Calendar",
    myHabits: "My Habits",
    remove: "Remove",
    addHabit: "Add habit",
    name: "Name",
    dailyProgress: "Daily Progress",
    weeklyProgress: "Weekly Progress",
    monthlyProgress: "Monthly Progress",
    goal: "Goal",
    done: "Done",
    open: "Open",
    analysisPerHabit: "Analysis per Habit",
    habit: "Habit",
    actual: "Actual",
    percent: "%",
    mentalState: "Mental State",
    mood: "Mood",
    motivation: "Motivation",
    top10: "Top 10 Habits",
    motivationTips: "Motivation & Tips",
    topicPlaceholder: "e.g. bad day at school, stress, no motivation …",
    topicEmptyHint: "Type in a topic – e.g. how your day was – and get matching suggestions.",
    quoteOfDay: "Quote of the Day",
    nextQuote: "Next",
    journal: "Notes & Journal",
    toToday: "Go to today",
    journalPlaceholder: "How was your day? What did you notice?",
    journalTitlePlaceholder: "Entry title (e.g. My first day)",
    titleRequired: "Please enter a title.",
    textRequired: "Please enter some text.",
    entryNotSaved: "Entry not saved persistently",
    unsavedChanges: "Unsaved changes",
    saved: "Saved",
    save: "Save",
    earlierEntries: "Earlier entries",
    noSavedEntries: "No saved entries yet.",
    water: (day) => `Water intake · ${day}`,
    glasses: "glasses",
    badges: "Badges",
    streak: "day streak",
    storageWarning: (detail) => `⚠️ Persistent saving not possible: ${detail}`,
    // events tab
    eventsTitle: "Appointments & Scheduled Events",
    newEvent: "New Event",
    editEvent: "Edit Event",
    eventName: "Name",
    eventNamePlaceholder: "e.g. Doctor's appointment, Training",
    eventDate: "Date",
    eventTime: "Time",
    eventDescription: "Description (optional)",
    eventDescriptionPlaceholder: "Event details …",
    saveEvent: "Save",
    cancel: "Cancel",
    upcoming: "Upcoming",
    past: "Done",
    noEvents: "No events added yet.",
    edit: "Edit",
    delete: "Delete",
    markDone: "Mark as done",
    markOpen: "Mark as open",
    autoCompleted: "auto-completed",
    fillNameDate: "Please provide a name and date.",
    eventSaved: "Event saved",
    eventDeleted: "Event deleted",
    eventNotSaved: "Event not saved persistently",
    // settings: background image
    backgroundImage: "Background image",
    backgroundImageUrlPlaceholder: "Paste image URL …",
    uploadImage: "Upload image",
    bgTargetDashboard: "Whole dashboard",
    bgTargetJournal: "Journal only",
    // water history
    waterHistory: "History",
    // food tracker
    foodTracker: "Healthy & Unhealthy Food Tracker",
    ateHealthy: "Ate healthy",
    ateUnhealthy: "Ate unhealthy",
    healthy: "Healthy",
    unhealthy: "Unhealthy",
    foodWarning: "You've eaten a lot of unhealthy food this week. Try something healthy tomorrow!",
    last7Days: "Last 7 days",
    // notifications
    notifications: "Notifications",
    dueSoon: "⚠️ Due soon",
    completedBadge: "✅ Done",
    noUpcomingEvents: "No upcoming events.",
    // manifesto / about
    aboutInfoButton: "!",
    aboutTooltip: "About this project",
    aboutPopupTitle: "Thank you for being here",
    aboutPopupText: "This website will never cost anything. It's meant for anyone who wants a bit more structure, reflection, and progress in their everyday life — no matter what they can afford. If this dashboard helps you, that's already enough.",
    closeButton: "Close",
    // challenge dice
    challengeTitle: "Challenge Dice",
    rollDice: "Roll",
    diffEasy: "Easy",
    diffMedium: "Medium",
    diffHard: "Hard",
    firstChallengeHint: "Roll your first challenge!",
    markDoneChallenge: "Mark as done",
    noChallengesYet: "No challenges rolled yet.",
    rolledLabel: "Rolled",
    challengeHistoryTitle: "History",
    // routines
    routinesTitle: "Routines",
    routinesSub: "Your recurring training plans",
    newRoutine: "New Routine",
    routineName: "Name",
    routineNamePlaceholder: "e.g. Push Day",
    routineDescription: "Description",
    routineDescriptionPlaceholder: "e.g. All push exercises",
    routineDuration: "Duration (minutes)",
    routineGoal: "Goal",
    routineGoalPlaceholder: "e.g. 3 sets per exercise",
    routineCategory: "Category",
    catStrength: "Strength",
    catEndurance: "Endurance",
    catMobility: "Mobility",
    saveRoutine: "Save routine",
    noRoutines: "No routines created yet.",
    markRoutineDone: "Done",
    markRoutineSkipped: "Skipped",
    routineDoneFeedback: ["Strong work. Keep it up. 🔥", "That's how you stay consistent. 💪", "One more point for you. ⚡", "Cleanly executed. 🚀"],
    routineSkippedFeedback: ["No drama — get back at it tomorrow.", "Short break, no excuses.", "Noted. It counts again next time.", "Not ideal, but not the end of the world."],
    routineStreak: "Streak",
    todayStatus: "Today",
    fillRoutineName: "Please enter a name.",
    minutesShort: "min",
    // goals
    goalsTitle: "Goals",
    goalsSub: "Your long-term plans",
    newGoal: "New Goal",
    goalName: "Name",
    goalNamePlaceholder: "e.g. lose 10 kg",
    goalDate: "Target date",
    goalPeriod: "Period",
    goalPeriodPlaceholder: "e.g. 3 months",
    goalCategory: "Category",
    catHealth: "Health",
    catFitness: "Fitness",
    catCareer: "Career",
    catLearning: "Learning",
    saveGoal: "Save goal",
    noGoals: "No goals added yet.",
    progress: "Progress",
    goalAchieved: "Achieved!",
    fillGoalName: "Please provide a name and date.",
    deleteGoal: "Delete",
  },
};

const DEFAULT_HABITS = [
  { id: "h1", name: "Wake up at 06:00", emoji: "🌅" },
  { id: "h2", name: "Meditation", emoji: "🧘" },
  { id: "h3", name: "GYM", emoji: "💪" },
  { id: "h4", name: "Cold Shower", emoji: "🚿" },
  { id: "h5", name: "Work", emoji: "💼" },
  { id: "h6", name: "Read 10 pages", emoji: "📖" },
  { id: "h7", name: "Learn a skill", emoji: "🎓" },
  { id: "h8", name: "No sugar", emoji: "🍬" },
  { id: "h9", name: "No alcohol", emoji: "🍷" },
  { id: "h10", name: "1H social media", emoji: "📱" },
  { id: "h11", name: "Planning", emoji: "📝" },
  { id: "h12", name: "Sleep before 11:00", emoji: "😴" },
];

/* ============================================================================
   QUOTES — large rotating pool (auto-rotates every 10 min + manual "Next")
============================================================================ */

const QUOTES = [
  { text: "Disziplin ist die Brücke zwischen Zielen und Erfolgen.", author: "Jim Rohn" },
  { text: "Man muss das Unwahrscheinliche versuchen, um das Unmögliche zu erreichen.", author: "Hermann Hesse" },
  { text: "Der Weg entsteht, indem man ihn geht.", author: "Franz Kafka" },
  { text: "Kleine tägliche Verbesserungen führen mit der Zeit zu erstaunlichen Ergebnissen.", author: "Robin Sharma" },
  { text: "Motivation bringt dich in Gang. Gewohnheit hält dich in Bewegung.", author: "Jim Ryun" },
  { text: "Du musst nicht großartig sein, um anzufangen, aber du musst anfangen, um großartig zu sein.", author: "Zig Ziglar" },
  { text: "Erfolg ist die Summe kleiner Anstrengungen, die täglich wiederholt werden.", author: "Robert Collier" },
  { text: "Was du heute tust, kann dein Morgen verbessern.", author: "Unbekannt" },
  { text: "Der schwerste Schritt ist immer der erste.", author: "Unbekannt" },
  { text: "Konsequenz schlägt Intensität – jeden Tag.", author: "Unbekannt" },
  { text: "Ein Tag ohne Fortschritt ist kein verlorener Tag, solange du morgen weitermachst.", author: "Unbekannt" },
  { text: "Wachstum beginnt dort, wo deine Komfortzone endet.", author: "Unbekannt" },
  { text: "Du wirst nicht jeden Tag motiviert sein. Deshalb brauchst du Disziplin.", author: "Unbekannt" },
  { text: "Der beste Zeitpunkt anzufangen war gestern. Der zweitbeste ist jetzt.", author: "Unbekannt" },
  { text: "Vertraue dem Prozess, nicht nur dem Ergebnis.", author: "Unbekannt" },
  { text: "Wer nicht jeden Tag etwas für sich tut, betrügt sich selbst.", author: "Unbekannt" },
  { text: "Zwischen Reiz und Reaktion liegt ein Raum. In diesem Raum liegt unsere Macht zu wählen.", author: "Viktor Frankl" },
  { text: "Wer aufhört, besser zu werden, hat aufgehört, gut zu sein.", author: "Philip Rosenthal" },
  { text: "Die Zukunft hängt davon ab, was du heute tust.", author: "Mahatma Gandhi" },
  { text: "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.", author: "Seneca" },
  { text: "Jeder Meister war einmal ein Anfänger.", author: "Unbekannt" },
  { text: "Es ist nie zu spät, das zu werden, was man hätte sein können.", author: "George Eliot" },
  { text: "Man sieht nur mit dem Herzen gut. Das Wesentliche ist für die Augen unsichtbar.", author: "Antoine de Saint-Exupéry" },
  { text: "Der Optimist sieht in jeder Gefahr eine Chance, der Pessimist in jeder Chance eine Gefahr.", author: "Winston Churchill" },
  { text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", author: "Bertolt Brecht" },
  { text: "Fange nicht an, den Sturm zu fürchten. Lerne, im Regen zu tanzen.", author: "Unbekannt" },
  { text: "Auch der längste Weg beginnt mit dem ersten Schritt.", author: "Laotse" },
  { text: "Was mich nicht umbringt, macht mich stärker.", author: "Friedrich Nietzsche" },
  { text: "Du bist stärker, als du glaubst.", author: "Unbekannt" },
  { text: "Träume nicht dein Leben, lebe deinen Traum.", author: "Unbekannt" },
  { text: "Erfolg hat drei Buchstaben: TUN.", author: "Johann Wolfgang von Goethe" },
  { text: "Wer glaubt, etwas zu sein, hat aufgehört, etwas zu werden.", author: "Sokrates" },
  { text: "Manchmal muss man ganz unten gewesen sein, um zu wissen, wie schön es oben ist.", author: "Unbekannt" },
  { text: "Es kommt nicht darauf an, wie langsam du gehst, solange du nicht stehen bleibst.", author: "Konfuzius" },
  { text: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi" },
  { text: "Am Ende werden wir nicht die Worte der Feinde erinnern, sondern das Schweigen der Freunde.", author: "Martin Luther King" },
  { text: "Jeder Tag ist eine neue Chance, dein Leben zu ändern.", author: "Unbekannt" },
  { text: "Der Wert eines Menschen zeigt sich in schwierigen Zeiten.", author: "Unbekannt" },
  { text: "Habe Mut, dich deines eigenen Verstandes zu bedienen.", author: "Immanuel Kant" },
  { text: "Alles, was du dir vorstellen kannst, ist real.", author: "Pablo Picasso" },
  { text: "Wer nicht wagt, der nicht gewinnt.", author: "Unbekannt" },
  { text: "Es sind nicht die Berge vor uns, die uns aufhalten, sondern der Kiesel im Schuh.", author: "Unbekannt" },
  { text: "Glück ist kein Zufall. Es ist meistens das Ergebnis harter Arbeit.", author: "Unbekannt" },
  { text: "Vergleiche dich nicht mit anderen. Vergleiche dich mit dem, der du gestern warst.", author: "Unbekannt" },
  { text: "Der Charakter eines Menschen zeigt sich in seinen Gewohnheiten.", author: "Unbekannt" },
  { text: "Manche Menschen wollen, dass es passiert, manche wünschen, dass es passiert, andere lassen es passieren.", author: "Michael Jordan" },
  { text: "Fehler sind der Beweis dafür, dass du es versuchst.", author: "Unbekannt" },
  { text: "Egal wie langsam du fährst, du überholst jeden, der zu Hause auf der Couch sitzt.", author: "Unbekannt" },
  { text: "Perfektion ist nicht erreichbar, aber wenn wir nach Perfektion streben, können wir Exzellenz erreichen.", author: "Vince Lombardi" },
  { text: "Der einzige Ort, an dem Erfolg vor Arbeit kommt, ist im Wörterbuch.", author: "Vidal Sassoon" },
  { text: "Es ist besser, ein kurzes Leben voller dem zu haben, was du liebst, als ein langes Leben voller dem, was du hasst.", author: "Unbekannt" },
  { text: "Wer immer tut, was er schon kann, bleibt immer das, was er schon ist.", author: "Henry Ford" },
  { text: "Du wirst nie stärker sein als heute, wenn du nicht jetzt anfängst.", author: "Unbekannt" },
  { text: "Ein ruhiges Meer hat noch nie einen guten Seemann hervorgebracht.", author: "Unbekannt" },
  { text: "Rückschläge sind Vorwärtsschritte in Verkleidung.", author: "Unbekannt" },
  { text: "Die einzige Grenze für unsere Verwirklichung von morgen sind unsere Zweifel von heute.", author: "Franklin D. Roosevelt" },
  { text: "Klein anfangen, aber anfangen.", author: "Unbekannt" },
  { text: "Selbstdisziplin ist die Fähigkeit, dich selbst dazu zu bringen zu tun, was du tun solltest, egal wie du dich fühlst.", author: "Unbekannt" },
  { text: "Es ist egal, wie oft du fällst. Wichtig ist, wie oft du wieder aufstehst.", author: "Vince Lombardi" },
  { text: "Große Dinge werden nie durch Bequemlichkeit erreicht.", author: "Unbekannt" },
  { text: "Du hast heute schon überlebt, was gestern unmöglich schien.", author: "Unbekannt" },
];

const QUOTES_EN = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "One must still have chaos in oneself to give birth to a dancing star.", author: "Hermann Hesse" },
  { text: "The path is made by walking.", author: "Franz Kafka" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "Motivation gets you going. Habit gets you there.", author: "Jim Ryun" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
  { text: "What you do today can improve all your tomorrows.", author: "Unknown" },
  { text: "The hardest step is always the first one.", author: "Unknown" },
  { text: "Consistency beats intensity — every day.", author: "Unknown" },
  { text: "A day without progress isn't lost as long as you keep going tomorrow.", author: "Unknown" },
  { text: "Growth begins where your comfort zone ends.", author: "Unknown" },
  { text: "You won't be motivated every day. That's why you need discipline.", author: "Unknown" },
  { text: "The best time to start was yesterday. The next best time is now.", author: "Unknown" },
  { text: "Trust the process, not just the outcome.", author: "Unknown" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose.", author: "Viktor Frankl" },
  { text: "Whoever stops getting better has stopped being good.", author: "Philip Rosenthal" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It's not that we have too little time, but that we lose too much.", author: "Seneca" },
  { text: "Every master was once a beginner.", author: "Unknown" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "It is only with the heart that one can see rightly.", author: "Antoine de Saint-Exupéry" },
  { text: "The pessimist sees difficulty in every opportunity; the optimist sees opportunity in every difficulty.", author: "Winston Churchill" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Laozi" },
  { text: "What doesn't kill you makes you stronger.", author: "Friedrich Nietzsche" },
  { text: "You are stronger than you think.", author: "Unknown" },
  { text: "Don't dream your life, live your dream.", author: "Unknown" },
  { text: "Success has three letters: DO.", author: "Johann Wolfgang von Goethe" },
  { text: "He who thinks he has arrived has stopped growing.", author: "Socrates" },
  { text: "Sometimes you have to be at rock bottom to know how good the top feels.", author: "Unknown" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King" },
  { text: "Every day is a new chance to change your life.", author: "Unknown" },
  { text: "A person's true worth shows itself in difficult times.", author: "Unknown" },
  { text: "Dare to use your own understanding.", author: "Immanuel Kant" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Nothing ventured, nothing gained.", author: "Unknown" },
  { text: "It's not the mountains ahead that wear you out, it's the pebble in your shoe.", author: "Unknown" },
  { text: "Happiness is not by chance, but by choice — mostly, hard work.", author: "Unknown" },
  { text: "Don't compare yourself to others. Compare yourself to who you were yesterday.", author: "Unknown" },
  { text: "Your character shows in your habits.", author: "Unknown" },
  { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
  { text: "Mistakes are proof that you are trying.", author: "Unknown" },
  { text: "No matter how slow you go, you're still lapping everybody on the couch.", author: "Unknown" },
  { text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
  { text: "The only place success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "It is better to have a short life full of what you love than a long life full of what you hate.", author: "Unknown" },
  { text: "If you always do what you've always done, you'll always be what you've always been.", author: "Henry Ford" },
  { text: "You'll never be stronger than today if you don't start now.", author: "Unknown" },
  { text: "Smooth seas never made a skilled sailor.", author: "Unknown" },
  { text: "Setbacks are just setups for a comeback.", author: "Unknown" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Start small, but start.", author: "Unknown" },
  { text: "Self-discipline is the ability to make yourself do what you should do, regardless of how you feel.", author: "Unknown" },
  { text: "It doesn't matter how many times you fall. What matters is how many times you get back up.", author: "Vince Lombardi" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "You already survived what felt impossible yesterday.", author: "Unknown" },
];

/* ============================================================================
   MOTIVATION TIPS — large keyword-matched database (20 categories × 6-8 tips)
============================================================================ */

const TIP_BANK = {
  de: [
    { id: "school", keywords: ["schule","schultag","uni","universität","prüfung","klausur","test","lernen","hausaufgaben","referat","noten"],
      tips: [
        "Ein schlechter Schultag ist ein Datenpunkt, kein Urteil über dich. Morgen fängt neu an.",
        "Teile die nächste Aufgabe in 10-Minuten-Blöcke – kleine Schritte schlagen große Vorsätze.",
        "Schreib dir eine Sache auf, die heute trotzdem funktioniert hat, so klein sie auch war.",
        "Noten sind eine Momentaufnahme, kein Maßstab für deinen Wert als Mensch.",
        "Frag gezielt nach Hilfe, wenn ein Thema nicht sitzt – das ist kein Zeichen von Schwäche.",
        "Plane Lernpausen aktiv ein: 25 Minuten fokussiert, 5 Minuten wirklich abschalten.",
      ]},
    { id: "exam", keywords: ["prüfungsangst","angst vor prüfung","versagensangst"],
      tips: [
        "Prüfungsangst sinkt oft, wenn du dich auf den Ablauf statt auf das Ergebnis konzentrierst.",
        "Stell dir vor, du gehst die Prüfung schon einmal gedanklich durch – das nimmt Anspannung.",
        "Atme vor der Prüfung bewusst viermal tief ein und aus, das beruhigt das Nervensystem.",
        "Du musst nicht alles wissen, um gut abzuschneiden. Fokussiere dich auf das, was sitzt.",
        "Ein kurzer Spaziergang vor der Prüfung kann helfen, Anspannung abzubauen.",
      ]},
    { id: "sport", keywords: ["sport","fitness","gym","training","workout","muskelkater","laufen","joggen"],
      tips: [
        "Ein ausgelassenes Training ist kein verlorener Tag – die Reihe zählt mehr als der einzelne Tag.",
        "Setz dir für heute eine kleinere Version der Übung, statt sie ganz zu streichen.",
        "Regeneration ist Teil des Trainings, nicht die Pause davon.",
        "Muskelkater zeigt, dass dein Körper sich anpasst – leichte Bewegung hilft oft mehr als Stillstand.",
        "Motivation kommt oft erst nach den ersten Minuten Bewegung, nicht davor.",
        "Vergleiche dich mit deinem eigenen letzten Training, nicht mit anderen.",
      ]},
    { id: "tired", keywords: ["müde","erschöpft","energie","kraftlos","ausgelaugt","antriebslos"],
      tips: [
        "Müdigkeit ist ein Signal, kein Charakterfehler. Höre kurz hin, bevor du weitermachst.",
        "Ein Glas Wasser, ein offenes Fenster, fünf Minuten ohne Bildschirm – oft reicht das für einen Reset.",
        "Plane heute nur die eine Sache ein, die wirklich zählt, und lass den Rest liegen.",
        "Erschöpfung über längere Zeit ist ein Grund, bewusst kürzerzutreten, nicht mehr zu leisten.",
        "Ein kurzer Powernap von 15-20 Minuten kann die Konzentration deutlich verbessern.",
      ]},
    { id: "stress", keywords: ["stress","überfordert","druck","chaos","zuviel","gestresst"],
      tips: [
        "Schreib alles auf, was in deinem Kopf herumschwirrt – aufgeschrieben wiegt es weniger.",
        "Frag dich: Was ist die eine Sache, die heute wirklich fällig ist? Der Rest kann warten.",
        "Drei tiefe Atemzüge verändern nichts an der Aufgabe, aber viel daran, wie du sie angehst.",
        "Priorisiere mit einer einfachen Liste: dringend & wichtig zuerst, Rest später.",
        "Ein kurzer Spaziergang an der frischen Luft senkt das Stresslevel messbar.",
        "Sag notfalls bewusst 'Nein' zu einer zusätzlichen Aufgabe – Grenzen schützen deine Energie.",
      ]},
    { id: "sad", keywords: ["traurig","niedergeschlagen","schlecht drauf","down","frustriert","enttäuscht"],
      tips: [
        "Ein schwerer Tag heißt nicht, dass die Woche schwer wird. Gib dir Erlaubnis, langsamer zu machen.",
        "Ruf jemanden an, mit dem reden leichtfällt – Verbindung wirkt oft schneller als Ablenkung.",
        "Sei mit dir so geduldig, wie du es bei einem guten Freund wärst.",
        "Gefühle kommen und gehen wie Wellen – auch dieses wird nicht ewig so intensiv bleiben.",
        "Erlaube dir, den Tag einfach nur zu überstehen, ohne produktiv sein zu müssen.",
      ]},
    { id: "motivation", keywords: ["motivation","antrieb","lustlos","keine lust","faul","unlust"],
      tips: [
        "Motivation kommt oft nach dem Anfangen, nicht davor. Starte mit zwei Minuten.",
        "Mach die kleinstmögliche Version der Gewohnheit – Konsistenz schlägt Intensität.",
        "Erinnere dich, warum du damit angefangen hast. Das Warum trägt, wenn das Wollen fehlt.",
        "Leg dir die erste Handlung so einfach wie möglich hin, damit die Hürde zum Start winzig ist.",
        "Verfolge Fortschritt statt Perfektion – jeder kleine Schritt zählt sichtbar.",
        "Feiere kleine Erfolge bewusst, auch wenn sie unscheinbar wirken.",
      ]},
    { id: "work", keywords: ["arbeit","job","chef","meeting","büro","kollege","überstunden"],
      tips: [
        "Ein anstrengender Arbeitstag endet an der Tür – nimm dir bewusst einen Übergangsmoment.",
        "Notier dir morgen früh die eine Sache, die den Tag schon zu einem Erfolg macht.",
        "Nicht jede Reibung im Job ist ein Problem, das du heute lösen musst.",
        "Setz dir klare Feierabendzeiten – Erholung ist Teil guter Leistung, nicht ihr Gegenteil.",
        "Sprich schwierige Themen mit Kollegen sachlich und zeitnah an, statt sie anzustauen.",
      ]},
    { id: "sleep", keywords: ["schlaf","schlaflos","wach","nacht","einschlafen","müdigkeit"],
      tips: [
        "Bildschirm eine halbe Stunde vor dem Schlafen weglegen macht oft mehr Unterschied als gedacht.",
        "Ein fester Zeitpunkt zum Aufstehen stabilisiert den Rhythmus schneller als ein fester Zeitpunkt zum Einschlafen.",
        "Wenn der Kopf nicht abschaltet, schreib die Gedanken kurz auf – raus aus dem Kopf, aufs Papier.",
        "Koffein am Nachmittag kann den Schlaf noch Stunden später stören.",
        "Ein ruhiges Ritual vor dem Schlafen signalisiert dem Körper: jetzt kommt Ruhe.",
      ]},
    { id: "relationship", keywords: ["beziehung","streit","liebeskummer","freund","freundin","partner","liebe","trennung"],
      tips: [
        "Ein Streit heute entscheidet nicht automatisch über morgen. Gib dem Abstand Raum.",
        "Manchmal hilft es mehr, gehört zu werden, als eine Lösung zu finden – auch bei dir selbst.",
        "Sei ehrlich mit dir, was du gerade brauchst: Nähe, Abstand oder einfach Schlaf.",
        "Liebeskummer braucht Zeit – erlaube dir, ihn zu fühlen, statt ihn wegzudrücken.",
        "Rede mit einer Person deines Vertrauens über das, was dich beschäftigt.",
      ]},
    { id: "friendship", keywords: ["freundschaft","freunde","ausgeschlossen","einsam unter freunden","gruppe"],
      tips: [
        "Echte Freundschaften überstehen auch mal eine Phase der Distanz.",
        "Sprich offen an, wenn dich etwas an einer Freundschaft stört – Klarheit schafft Vertrauen.",
        "Investiere Zeit in die Freundschaften, die dir wirklich guttun.",
        "Es ist okay, sich von Freundschaften zu lösen, die dir nicht mehr guttun.",
        "Ein kurzes 'Ich denke an dich' an einen Freund kann beiden Seiten guttun.",
      ]},
    { id: "health", keywords: ["gesundheit","krank","schmerzen","erkältet","kopfschmerzen"],
      tips: [
        "Dein Körper braucht bei Krankheit vor allem eins: Ruhe. Leistung kann warten.",
        "Kleine Anzeichen ernst zu nehmen ist keine Übertreibung, sondern Selbstfürsorge.",
        "Ausreichend trinken und schlafen unterstützt die Genesung mehr als du denkst.",
        "Wenn Beschwerden anhalten, ist ein Arztbesuch der sinnvollste nächste Schritt.",
      ]},
    { id: "fear", keywords: ["angst","furcht","panik","sorge","ängstlich"],
      tips: [
        "Angst ist ein Schutzmechanismus, keine Vorhersage der Zukunft.",
        "Benenne genau, wovor du Angst hast – das macht sie oft schon greifbarer und kleiner.",
        "Konzentriere dich auf den nächsten kleinen Schritt, nicht auf das große Ganze.",
        "Langsames Ausatmen (länger als das Einatmen) beruhigt das Nervensystem spürbar.",
        "Sprich über deine Angst mit jemandem – ausgesprochen wirkt sie oft weniger bedrohlich.",
      ]},
    { id: "conflict", keywords: ["geschlagen","gewalt","kampf","schlägerei","angegriffen","bedroht","konflikt","streit eskaliert"],
      tips: [
        "Deine Sicherheit hat immer Vorrang – bring dich aus einer gefährlichen Situation, wenn du kannst.",
        "Sprich mit jemandem, dem du vertraust, über das, was passiert ist. Du musst das nicht allein tragen.",
        "Bei akuter Gefahr zögere nicht, Hilfe zu holen, z. B. den Notruf oder eine Vertrauensperson.",
        "Mentale Stärke zeigt sich auch darin, Hilfe anzunehmen, statt alles allein bewältigen zu wollen.",
        "Ein Konflikt im Affekt löst sich selten gut – wenn möglich, schaffe erst Abstand, bevor du reagierst.",
        "Du bist nicht schuld an Gewalt, die dir angetan wurde.",
      ]},
    { id: "family", keywords: ["familie","eltern","geschwister","mutter","vater","zuhause"],
      tips: [
        "Familienkonflikte fühlen sich oft größer an, weil die Beziehung so nah ist. Das ist normal.",
        "Ein offenes Gespräch in Ruhe wirkt meist mehr als ein Streit in der Hitze des Moments.",
        "Du darfst eigene Grenzen setzen, auch gegenüber Familie.",
        "Wenn direktes Reden schwerfällt, kann ein Brief oder eine Nachricht ein guter erster Schritt sein.",
      ]},
    { id: "money", keywords: ["geld","finanzen","schulden","arm","pleite","kosten"],
      tips: [
        "Ein klarer Überblick über Einnahmen und Ausgaben nimmt oft schon einen Teil des Drucks.",
        "Finanzielle Sorgen sind kein persönliches Versagen, sondern eine lösbare Aufgabe Schritt für Schritt.",
        "Sprich mit jemandem, der Erfahrung mit dem Thema hat, statt allein zu grübeln.",
        "Kleine, realistische Sparziele wirken motivierender als ein großes, vages Ziel.",
      ]},
    { id: "selfdoubt", keywords: ["selbstzweifel","unsicher","zweifel","nicht gut genug","versagen"],
      tips: [
        "Selbstzweifel sind ein Gedanke, keine Tatsache.",
        "Schreib dir drei Dinge auf, die dir in der Vergangenheit gut gelungen sind.",
        "Vergleiche dich mit deinem eigenen gestrigen Ich, nicht mit anderen.",
        "Perfektion ist kein realistischer Maßstab – 'gut genug' ist oft wirklich genug.",
        "Rede mit dir selbst so, wie du mit einem guten Freund sprechen würdest.",
      ]},
    { id: "loneliness", keywords: ["einsam","allein","niemand da","isoliert"],
      tips: [
        "Einsamkeit ist ein Gefühl, keine dauerhafte Wahrheit über dein Leben.",
        "Ein kleiner erster Schritt wie eine Nachricht an jemanden kann viel bewegen.",
        "Gemeinschaften – online oder vor Ort – zu einem Hobby können neue Verbindungen schaffen.",
        "Es ist in Ordnung, aktiv um Nähe oder Gesellschaft zu bitten.",
      ]},
    { id: "future", keywords: ["zukunftsangst","zukunft","unsicherheit","was wird","orientierungslos"],
      tips: [
        "Niemand kennt die Zukunft vollständig – Unsicherheit gehört zum Leben dazu.",
        "Fokussiere dich auf den nächsten sinnvollen Schritt, statt den ganzen Weg zu planen.",
        "Kleine Entscheidungen jetzt beeinflussen die Richtung mehr als ein perfekter großer Plan.",
        "Erlaube dir, Pläne im Laufe der Zeit zu ändern – das ist kein Scheitern.",
      ]},
    { id: "grief", keywords: ["trauer","verlust","verloren","abschied","vermisse"],
      tips: [
        "Trauer hat kein festes Zeitfenster – gib dir die Zeit, die du brauchst.",
        "Es gibt keinen 'richtigen' Weg zu trauern. Deiner ist der richtige für dich.",
        "Rede über den Menschen oder die Sache, die du vermisst, wenn dir danach ist.",
        "Sich Unterstützung zu holen ist bei Verlust keine Schwäche, sondern ein guter Schritt.",
      ]},
    { id: "anger", keywords: ["wut","wütend","zorn","sauer","genervt"],
      tips: [
        "Wut ist ein Signal, dass etwas für dich nicht in Ordnung ist – sie darf gefühlt werden.",
        "Bevor du reagierst, zähl innerlich bis zehn oder verlasse kurz die Situation.",
        "Bewegung, z. B. ein zügiger Spaziergang, hilft, Anspannung abzubauen.",
        "Schreib auf, was dich wütend macht, bevor du es aussprichst – das ordnet die Gedanken.",
      ]},
    { id: "time", keywords: ["zeitmanagement","keine zeit","zeitdruck","termine"],
      tips: [
        "Plane realistisch weniger ein, als du denkst zu schaffen – das reduziert Zeitdruck spürbar.",
        "Blockiere feste Zeitfenster für wichtige Aufgaben, statt sie 'irgendwann' zu erledigen.",
        "Nicht alles muss heute passieren. Frage dich, was wirklich diese Woche fällig ist.",
      ]},
  ],
  en: [
    { id: "school", keywords: ["school","exam","test","study","university","college","homework","grades"],
      tips: [
        "A bad day at school is a data point, not a verdict on you. Tomorrow starts fresh.",
        "Break the next task into 10-minute chunks – small steps beat big resolutions.",
        "Write down one thing that still worked today, no matter how small.",
        "Grades are a snapshot, not a measure of your worth as a person.",
        "Ask for help on a topic that isn't clicking – that's not a weakness.",
        "Schedule real breaks: 25 minutes focused, 5 minutes fully off.",
      ]},
    { id: "exam", keywords: ["exam anxiety","test anxiety","fear of failing"],
      tips: [
        "Exam anxiety often drops when you focus on the process instead of the outcome.",
        "Mentally rehearse the exam beforehand – it takes the edge off the tension.",
        "Take four deliberate deep breaths before the exam to calm your nervous system.",
        "You don't need to know everything to do well. Focus on what you do know.",
        "A short walk before the exam can help release built-up tension.",
      ]},
    { id: "sport", keywords: ["sport","fitness","gym","workout","training","sore","running","jogging"],
      tips: [
        "A skipped workout isn't a lost day – the streak matters more than any single day.",
        "Do a smaller version of today's workout instead of skipping it entirely.",
        "Recovery is part of training, not a break from it.",
        "Soreness means your body is adapting – light movement often helps more than rest.",
        "Motivation usually shows up after the first few minutes of moving, not before.",
        "Compare yourself to your last workout, not to anyone else's.",
      ]},
    { id: "tired", keywords: ["tired","exhausted","energy","drained","fatigue","burnt out"],
      tips: [
        "Tiredness is a signal, not a character flaw. Listen to it before pushing on.",
        "A glass of water, an open window, five screen-free minutes – often enough for a reset.",
        "Plan just the one thing that truly matters today, and let the rest wait.",
        "Ongoing exhaustion is a reason to scale down, not push harder.",
        "A short 15-20 minute power nap can noticeably improve focus.",
      ]},
    { id: "stress", keywords: ["stress","overwhelmed","pressure","chaos","too much","stressed"],
      tips: [
        "Write down everything swirling in your head – it weighs less on paper.",
        "Ask yourself: what's the one thing truly due today? Everything else can wait.",
        "Three deep breaths won't change the task, but they change how you approach it.",
        "Prioritize with a simple list: urgent-and-important first, everything else later.",
        "A short walk outside measurably lowers stress levels.",
        "It's okay to say no to one more task – boundaries protect your energy.",
      ]},
    { id: "sad", keywords: ["sad","down","frustrated","upset","low","disappointed"],
      tips: [
        "A hard day doesn't mean a hard week. Give yourself permission to slow down.",
        "Call someone easy to talk to – connection often works faster than distraction.",
        "Be as patient with yourself as you would be with a good friend.",
        "Feelings come and go like waves – this one won't stay this intense forever.",
        "It's fine to just get through the day without being productive.",
      ]},
    { id: "motivation", keywords: ["motivation","unmotivated","lazy","no drive"],
      tips: [
        "Motivation often follows starting, not the other way around. Start with two minutes.",
        "Do the smallest possible version of the habit – consistency beats intensity.",
        "Remember why you started. Your 'why' carries you when 'want to' runs out.",
        "Make the first action as easy as possible so the barrier to starting is tiny.",
        "Track progress, not perfection – every small step counts visibly.",
        "Celebrate small wins deliberately, even if they seem minor.",
      ]},
    { id: "work", keywords: ["work","job","boss","meeting","office","colleague","overtime"],
      tips: [
        "A hard workday ends at the door – give yourself a deliberate transition moment.",
        "Jot down tomorrow morning's one thing that already makes the day a win.",
        "Not every friction at work is a problem you must solve today.",
        "Set clear end-of-day boundaries – rest is part of good performance, not its opposite.",
        "Address issues with colleagues calmly and promptly rather than letting them build up.",
      ]},
    { id: "sleep", keywords: ["sleep","insomnia","awake","night","can't sleep"],
      tips: [
        "Putting the screen away half an hour before bed often matters more than expected.",
        "A fixed wake-up time stabilizes rhythm faster than a fixed bedtime.",
        "If your mind won't switch off, write the thoughts down – out of your head, onto paper.",
        "Afternoon caffeine can still disrupt sleep hours later.",
        "A calm pre-sleep ritual signals to your body that it's time to wind down.",
      ]},
    { id: "relationship", keywords: ["relationship","fight","breakup","friend","partner","love","dating"],
      tips: [
        "A fight today doesn't automatically decide tomorrow. Give it some space.",
        "Sometimes being heard matters more than finding a solution – with yourself too.",
        "Be honest about what you need right now: closeness, distance, or just sleep.",
        "Heartbreak takes time – let yourself feel it instead of pushing it away.",
        "Talk to someone you trust about what's on your mind.",
      ]},
    { id: "friendship", keywords: ["friendship","friends","left out","excluded","group"],
      tips: [
        "Real friendships can survive a phase of distance.",
        "Speak up when something bothers you in a friendship – clarity builds trust.",
        "Invest time in the friendships that actually feel good.",
        "It's okay to step back from friendships that no longer serve you.",
        "A quick 'thinking of you' message can lift both sides of a friendship.",
      ]},
    { id: "health", keywords: ["health","sick","pain","cold","headache","illness"],
      tips: [
        "When you're sick, your body mainly needs rest. Performance can wait.",
        "Taking small symptoms seriously is self-care, not overreacting.",
        "Drinking enough water and sleeping enough supports recovery more than you'd think.",
        "If symptoms persist, seeing a doctor is the most sensible next step.",
      ]},
    { id: "fear", keywords: ["fear","anxiety","panic","worry","anxious"],
      tips: [
        "Fear is a protective mechanism, not a forecast of the future.",
        "Naming exactly what you're afraid of often makes it feel smaller and clearer.",
        "Focus on the next small step instead of the whole picture.",
        "Slow exhales (longer than the inhale) noticeably calm the nervous system.",
        "Talk about your fear with someone – said out loud, it often feels less overwhelming.",
      ]},
    { id: "conflict", keywords: ["beaten","hit","violence","fight","attacked","threatened","conflict","assault"],
      tips: [
        "Your safety always comes first – remove yourself from a dangerous situation if you can.",
        "Talk to someone you trust about what happened. You don't have to carry it alone.",
        "In immediate danger, don't hesitate to get help, such as emergency services or someone you trust.",
        "Mental strength also means accepting help instead of trying to handle everything alone.",
        "Conflicts rarely resolve well in the heat of the moment – create distance first if you can.",
        "You are not to blame for violence that was done to you.",
      ]},
    { id: "family", keywords: ["family","parents","siblings","mother","father","home"],
      tips: [
        "Family conflicts often feel bigger because the relationship is so close. That's normal.",
        "A calm conversation usually works better than an argument in the heat of the moment.",
        "You're allowed to set boundaries, even with family.",
        "If talking directly feels hard, a letter or message can be a good first step.",
      ]},
    { id: "money", keywords: ["money","finances","debt","broke","poor","costs"],
      tips: [
        "A clear overview of income and expenses often relieves some of the pressure.",
        "Financial worries aren't personal failure — they're a solvable problem, step by step.",
        "Talk to someone experienced with the topic instead of worrying alone.",
        "Small, realistic savings goals feel more motivating than one big vague target.",
      ]},
    { id: "selfdoubt", keywords: ["self-doubt","insecure","doubt","not good enough","failure"],
      tips: [
        "Self-doubt is a thought, not a fact.",
        "Write down three things that have gone well for you in the past.",
        "Compare yourself to who you were yesterday, not to anyone else.",
        "Perfection isn't a realistic standard – 'good enough' really is often enough.",
        "Talk to yourself the way you'd talk to a good friend.",
      ]},
    { id: "loneliness", keywords: ["lonely","alone","nobody","isolated"],
      tips: [
        "Loneliness is a feeling, not a permanent truth about your life.",
        "A small first step, like messaging someone, can shift a lot.",
        "Joining a group — online or in person — around a hobby can create new connections.",
        "It's okay to actively ask for closeness or company.",
      ]},
    { id: "future", keywords: ["future anxiety","future","uncertainty","what's next","lost direction"],
      tips: [
        "No one fully knows the future – uncertainty is part of life.",
        "Focus on the next sensible step instead of planning the whole path.",
        "Small decisions now shape the direction more than one perfect big plan.",
        "Let yourself change plans over time – that's not failure.",
      ]},
    { id: "grief", keywords: ["grief","loss","lost someone","goodbye","miss them"],
      tips: [
        "Grief doesn't have a fixed timeline – give yourself the time you need.",
        "There's no 'right' way to grieve. Yours is the right one for you.",
        "Talk about the person or thing you miss whenever you feel like it.",
        "Seeking support after a loss isn't weakness — it's a good step.",
      ]},
    { id: "anger", keywords: ["anger","angry","furious","mad","irritated"],
      tips: [
        "Anger is a signal that something feels wrong to you – it's allowed to be felt.",
        "Before reacting, count to ten internally or step away briefly.",
        "Movement, like a brisk walk, helps release built-up tension.",
        "Write down what's making you angry before you say it out loud – it organizes your thoughts.",
      ]},
    { id: "time", keywords: ["time management","no time","time pressure","deadlines"],
      tips: [
        "Plan for less than you think you can do — it noticeably reduces time pressure.",
        "Block fixed time slots for important tasks instead of leaving them for 'someday'.",
        "Not everything has to happen today. Ask what's actually due this week.",
      ]},
  ],
};

const FALLBACK_TIPS = {
  de: (topic) => [
    `Was auch immer bei "${topic}" gerade schwerfällt – ein kleiner Schritt heute reicht völlig.`,
    "Fortschritt ist selten geradlinig. Ein durchwachsener Tag gehört genauso dazu wie ein guter.",
    "Frag dich: Was würde die beste Version von dir jetzt als Nächstes tun? Mach genau das, klein anfangen zählt.",
  ],
  en: (topic) => [
    `Whatever feels hard about "${topic}" right now – one small step today is enough.`,
    "Progress is rarely linear. A rough day belongs just as much as a good one.",
    "Ask yourself: what would the best version of you do next? Do exactly that, starting small counts.",
  ],
};

/* Match a free-text topic against the tip database. If several categories share a keyword hit,
   the first match wins; if nothing matches, a generic (but non-repeating-looking) fallback is used. */
function getTips(topic, lang) {
  const t = topic.trim().toLowerCase();
  if (!t) return [];
  const bank = TIP_BANK[lang] || TIP_BANK.de;
  const match = bank.find((cat) => cat.keywords.some((k) => t.includes(k)));
  return match ? match.tips : FALLBACK_TIPS[lang](topic.trim());
}

const BADGE_DEFS = [
  { id: "first", de: { label: "Erster Schritt", desc: "Erstes Habit abgehakt" }, en: { label: "First Step", desc: "First habit checked off" }, icon: "🌱", check: (s) => s.totalChecks >= 1 },
  { id: "streak3", de: { label: "3-Tage-Streak", desc: "3 Tage in Folge alles geschafft" }, en: { label: "3-Day Streak", desc: "3 days in a row completed" }, icon: "🔥", check: (s) => s.longestStreak >= 3 },
  { id: "streak7", de: { label: "7-Tage-Streak", desc: "7 Tage in Folge alles geschafft" }, en: { label: "7-Day Streak", desc: "7 days in a row completed" }, icon: "⚡", check: (s) => s.longestStreak >= 7 },
  { id: "streak14", de: { label: "14-Tage-Streak", desc: "14 Tage in Folge alles geschafft" }, en: { label: "14-Day Streak", desc: "14 days in a row completed" }, icon: "🚀", check: (s) => s.longestStreak >= 14 },
  { id: "streak30", de: { label: "30-Tage-Streak", desc: "30 Tage in Folge alles geschafft" }, en: { label: "30-Day Streak", desc: "30 days in a row completed" }, icon: "👑", check: (s) => s.longestStreak >= 30 },
  { id: "water", de: { label: "Wasserheld", desc: "An einem Tag 8 Gläser Wasser getrunken" }, en: { label: "Water Hero", desc: "Drank 8 glasses of water in one day" }, icon: "💧", check: (s) => s.maxWater >= 8 },
  { id: "journal", de: { label: "Tagebuch-Autor", desc: "Erste Notiz geschrieben" }, en: { label: "Journal Author", desc: "First note written" }, icon: "📔", check: (s) => s.noteCount >= 1 },
];

/* ============================================================================
   CHALLENGE DICE — difficulty-based random exercise generator with a
   persistent, chronological history (nothing ever expires or gets deleted)
============================================================================ */

const CHALLENGE_DIFFICULTIES = ["leicht", "mittel", "hard"];

const CHALLENGE_EXERCISES = {
  de: [
    { id: "pushups", name: "Liegestütze", values: { leicht: 20, mittel: 65, hard: 120 }, format: (v) => `${v} Liegestütze` },
    { id: "plank", name: "Plank", values: { leicht: "1 Minute", mittel: "2 Minuten", hard: "5 Minuten" }, format: (v) => `${v} Plank` },
    { id: "wallsit", name: "Wandsitzen", values: { leicht: "1:30 Minuten", mittel: "4 Minuten", hard: "8 Minuten" }, format: (v) => `${v} Wandsitzen` },
    { id: "jogging", name: "Joggen", values: { leicht: "5 km", mittel: "15 km", hard: "25 km" }, format: (v) => `${v} Joggen` },
    { id: "pullups", name: "Klimmzüge", values: { leicht: 3, mittel: 7, hard: 15 }, format: (v) => `${v} Klimmzüge` },
  ],
  en: [
    { id: "pushups", name: "Push-Ups", values: { leicht: 20, mittel: 65, hard: 120 }, format: (v) => `${v} Push-Ups` },
    { id: "plank", name: "Plank", values: { leicht: "1 minute", mittel: "2 minutes", hard: "5 minutes" }, format: (v) => `${v} Plank` },
    { id: "wallsit", name: "Wall Sit", values: { leicht: "1:30 minutes", mittel: "4 minutes", hard: "8 minutes" }, format: (v) => `${v} Wall Sit` },
    { id: "jogging", name: "Running", values: { leicht: "5 km", mittel: "15 km", hard: "25 km" }, format: (v) => `${v} Running` },
    { id: "pullups", name: "Pull-Ups", values: { leicht: 3, mittel: 7, hard: 15 }, format: (v) => `${v} Pull-Ups` },
  ],
};

function randomChallengeExercise(lang) {
  const list = CHALLENGE_EXERCISES[lang] || CHALLENGE_EXERCISES.de;
  return list[Math.floor(Math.random() * list.length)];
}

function makeChallengeEntry(difficulty, lang) {
  const ex = randomChallengeExercise(lang);
  const value = ex.values[difficulty];
  return {
    id: "c" + Date.now() + Math.random().toString(36).slice(2, 7),
    exerciseId: ex.id,
    text: ex.format(value),
    difficulty,
    rolledAt: new Date().toISOString(),
    done: false,
    doneAt: null,
  };
}

function challengeDayKey(iso) {
  return iso ? iso.slice(0, 10) : null;
}

/* ============================================================================
   CHALLENGE BADGES — expanded set (18), all computed from challengeHistory
============================================================================ */

const CHALLENGE_BADGE_DEFS = [
  { id: "first", de: { label: "Erste Challenge", desc: "1. Challenge erledigt" }, en: { label: "First Challenge", desc: "1st challenge completed" }, icon: "🎲", check: (s) => s.totalDone >= 1 },
  { id: "star5", de: { label: "Challenge-Star", desc: "5 Challenges erledigt" }, en: { label: "Challenge Star", desc: "5 challenges completed" }, icon: "⭐", check: (s) => s.totalDone >= 5 },
  { id: "pro20", de: { label: "Challenge-Pro", desc: "20 Challenges erledigt" }, en: { label: "Challenge Pro", desc: "20 challenges completed" }, icon: "🏅", check: (s) => s.totalDone >= 20 },
  { id: "iron50", de: { label: "Eisern", desc: "50 Challenges erledigt" }, en: { label: "Iron Will", desc: "50 challenges completed" }, icon: "🛡️", check: (s) => s.totalDone >= 50 },
  { id: "legend100", de: { label: "Legende", desc: "100 Challenges erledigt" }, en: { label: "Legend", desc: "100 challenges completed" }, icon: "👑", check: (s) => s.totalDone >= 100 },
  { id: "hardcore10", de: { label: "Hardcore", desc: "10 Hard-Challenges erledigt" }, en: { label: "Hardcore", desc: "10 hard challenges completed" }, icon: "💀", check: (s) => s.hardDone >= 10 },
  { id: "hardcore25", de: { label: "Eiskalt", desc: "25 Hard-Challenges erledigt" }, en: { label: "Ice Cold", desc: "25 hard challenges completed" }, icon: "🧊", check: (s) => s.hardDone >= 25 },
  { id: "weeklyHero", de: { label: "Wöchentlicher Held", desc: "An 7 Tagen in Folge eine Challenge erledigt" }, en: { label: "Weekly Hero", desc: "Completed a challenge 7 days in a row" }, icon: "🗓️", check: (s) => s.doneDaysLast7 >= 7 },
  { id: "monthlyChampion", de: { label: "Monatlicher Champion", desc: "An jedem Tag des Monats bisher eine Challenge erledigt" }, en: { label: "Monthly Champion", desc: "Completed a challenge every day this month so far" }, icon: "🏆", check: (s) => s.doneDaysThisMonth >= s.daysElapsedThisMonth && s.daysElapsedThisMonth >= 5 },
  { id: "allesfresser", de: { label: "Allesfresser", desc: "Jede Übungsart mindestens einmal erledigt" }, en: { label: "All-Rounder", desc: "Completed every exercise type at least once" }, icon: "🍽️", check: (s) => s.exercisesDone.size >= 5 },
  { id: "pullupKing", de: { label: "Klimmzug-König", desc: "Klimmzüge in allen Schwierigkeiten erledigt" }, en: { label: "Pull-Up King", desc: "Completed pull-ups at every difficulty" }, icon: "🤴", check: (s) => (s.exerciseDiffs.pullups ? s.exerciseDiffs.pullups.size : 0) >= 3 },
  { id: "plankMaster", de: { label: "Plank-Master", desc: "Plank in allen Schwierigkeiten erledigt" }, en: { label: "Plank Master", desc: "Completed plank at every difficulty" }, icon: "🧘", check: (s) => (s.exerciseDiffs.plank ? s.exerciseDiffs.plank.size : 0) >= 3 },
  { id: "wallsitMaster", de: { label: "Wandsitz-Meister", desc: "Wandsitzen in allen Schwierigkeiten erledigt" }, en: { label: "Wall Sit Master", desc: "Completed wall sit at every difficulty" }, icon: "🪑", check: (s) => (s.exerciseDiffs.wallsit ? s.exerciseDiffs.wallsit.size : 0) >= 3 },
  { id: "enduranceBeast", de: { label: "Ausdauer-Tier", desc: "Joggen in allen Schwierigkeiten erledigt" }, en: { label: "Endurance Beast", desc: "Completed running at every difficulty" }, icon: "🐆", check: (s) => (s.exerciseDiffs.jogging ? s.exerciseDiffs.jogging.size : 0) >= 3 },
  { id: "pushupPower", de: { label: "Liegestütz-Power", desc: "Liegestütze in allen Schwierigkeiten erledigt" }, en: { label: "Push-Up Power", desc: "Completed push-ups at every difficulty" }, icon: "💥", check: (s) => (s.exerciseDiffs.pushups ? s.exerciseDiffs.pushups.size : 0) >= 3 },
  { id: "versatile", de: { label: "Vielseitig", desc: "Jede Übungsart mindestens einmal auf Hard erledigt" }, en: { label: "Versatile", desc: "Completed every exercise on Hard at least once" }, icon: "🌟", check: (s) => s.hardExercises.size >= 5 },
  { id: "entschlossen", de: { label: "Entschlossen", desc: "10 Challenges an einem Tag erledigt" }, en: { label: "Determined", desc: "10 challenges completed in one day" }, icon: "🔥", check: (s) => s.maxDoneInOneDay >= 10 },
  { id: "unzerstoerbar", de: { label: "Unzerstörbar", desc: "20 Challenges an einem Tag erledigt" }, en: { label: "Unstoppable", desc: "20 challenges completed in one day" }, icon: "⚡", check: (s) => s.maxDoneInOneDay >= 20 },
];

/* ============================================================================
   HELPERS
============================================================================ */

function ymd(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
function ymdFromDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function todayStr() { return ymdFromDate(new Date()); }
function dayOfMonthFromStr(dateStr) { return parseInt(dateStr.slice(-2), 10); }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function chunk7(arr) { const out = []; for (let i = 0; i < arr.length; i += 7) out.push(arr.slice(i, i + 7)); return out; }
function dayOfYear(d) { const start = new Date(d.getFullYear(), 0, 0); return Math.floor((d - start) / 86400000); }
function shade(hex, percent) {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + percent, g = ((num >> 8) & 0x00ff) + percent, b = (num & 0x0000ff) + percent;
    r = Math.max(Math.min(255, r), 0); g = Math.max(Math.min(255, g), 0); b = Math.max(Math.min(255, b), 0);
    return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  } catch (e) { return hex; }
}
function hexAlpha(hex, alphaHex) { return hex.length === 7 ? hex + alphaHex : hex; }

/* Random index different from the previous one (when the pool has more than one item) */
function randomIndexExcluding(len, excludeIdx) {
  if (len <= 1) return 0;
  let idx = Math.floor(Math.random() * len);
  while (idx === excludeIdx) idx = Math.floor(Math.random() * len);
  return idx;
}

function computeStreaks(habits, logs) {
  const dates = Object.keys(logs).sort();
  if (dates.length === 0 || habits.length === 0) return { current: 0, longest: 0 };
  const complete = (ds) => habits.every((h) => logs[ds] && logs[ds][h.id]);
  const start = new Date(dates[0] + "T00:00:00");
  const end = new Date();
  let longest = 0, run = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const ds = ymdFromDate(cursor);
    if (complete(ds)) { run++; longest = Math.max(longest, run); } else { run = 0; }
    cursor.setDate(cursor.getDate() + 1);
  }
  let current = 0;
  const c2 = new Date();
  while (complete(ymdFromDate(c2))) { current++; c2.setDate(c2.getDate() - 1); }
  return { current, longest };
}

function makeConfettiPieces(theme, n = 70) {
  const palette = [theme.primary, theme.accent, C.pink, C.green, C.amber];
  return Array.from({ length: n }, (_, i) => ({
    id: `${Date.now()}_${i}`,
    left: Math.random() * 100,
    color: palette[i % palette.length],
    duration: 2.2 + Math.random() * 1.6,
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
    round: Math.random() > 0.5,
  }));
}

/* Is this event due within the next 24 hours (and not already past)? */
function isDueSoon(ev) {
  if (!ev.date) return false;
  const dt = new Date(`${ev.date}T${ev.time || "23:59"}:00`).getTime();
  const now = Date.now();
  return dt >= now && dt - now <= 24 * 60 * 60 * 1000;
}
function isEventPast(ev) {
  if (!ev.date) return false;
  const dt = new Date(`${ev.date}T${ev.time || "23:59"}:00`).getTime();
  return dt < Date.now();
}

/* ============================================================================
   STORAGE (localStorage — persists across sessions in the visitor's browser)
============================================================================ */

async function storageSelfTest() {
  if (typeof window === "undefined" || !window.localStorage) return { ok: false, detail: "localStorage ist in diesem Browser nicht verfügbar." };
  try {
    const marker = "diag_" + Date.now();
    localStorage.setItem("__diag_dash__", marker);
    const readBack = localStorage.getItem("__diag_dash__");
    if (readBack !== marker) return { ok: false, detail: "Rücklesen fehlgeschlagen." };
    localStorage.removeItem("__diag_dash__");
    return { ok: true, detail: "OK" };
  } catch (e) { return { ok: false, detail: e && e.message ? e.message : String(e) }; }
}

async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fallback;
}

async function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) { console.error("Speichern fehlgeschlagen:", key, e); return false; }
}

/* ============================================================================
   GLOBAL STYLES
============================================================================ */

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

      .habit-app, .habit-app * { box-sizing: border-box; }
      .habit-app { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      .habit-app h1, .habit-app h2, .habit-app .display { font-family: 'Space Grotesk', 'Inter', sans-serif; }

      @keyframes fadeScaleIn { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes slideInLeft { from { opacity: 0; transform: translateX(-70px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slideInRight { from { opacity: 0; transform: translateX(70px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slideInTop { from { opacity: 0; transform: translateY(-60px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideInBottom { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulseGlow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes gradientDrift { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
      @keyframes blobDrift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(26px, -20px) scale(1.06); } }
      @keyframes particleFloat { 0% { transform: translateY(0) scale(1); opacity: 0; } 10% { opacity: 0.9; } 88% { opacity: 0.45; } 100% { transform: translateY(-112vh) scale(0.6); opacity: 0; } }
      @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 60% { opacity: 1; transform: scale(1.18); } 100% { transform: scale(1); } }
      @keyframes dotPop { 0% { transform: scale(1); } 35% { transform: scale(1.6); } 60% { transform: scale(0.85); } 100% { transform: scale(1); } }
      @keyframes cellPulse {
        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.55), 0 0 0 0 ${hexAlpha(theme.primary, "aa")}; transform: scale(1); }
        40% { transform: scale(1.22); }
        100% { box-shadow: 0 0 0 10px rgba(255,255,255,0), 0 0 22px 6px ${hexAlpha(theme.primary, "00")}; transform: scale(1); }
      }
      @keyframes confettiFall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(112vh) rotate(720deg); opacity: 0; }
      }
      @keyframes glowSweep {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes bounceDown {
        0%, 100% { transform: translateY(0); opacity: 0.55; }
        50% { transform: translateY(5px); opacity: 1; }
      }
      @keyframes quoteFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes badgeDotPop { 0% { transform: scale(0); } 70% { transform: scale(1.25); } 100% { transform: scale(1); } }
      @keyframes modalIn { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes diceSpin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(200deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
      @keyframes resultPop { 0% { opacity: 0; transform: scale(0.55); } 65% { opacity: 1; transform: scale(1.1); } 100% { transform: scale(1); } }
      @keyframes feedbackPop { 0% { opacity: 0; transform: translateY(-6px) scale(0.9); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

      .tab-content { animation: fadeScaleIn 0.4s ${SMOOTH} both; }

      .glass-card {
        background: ${C.glass}; border: 1px solid ${C.glassBorder}; border-radius: 22px;
        backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        transition: transform 0.32s ${ELASTIC}, box-shadow 0.35s ease, border-color 0.35s ease, background 0.4s ease;
        animation-duration: 0.75s; animation-timing-function: ${ELASTIC}; animation-fill-mode: both;
      }
      .glass-card.from-left { animation-name: slideInLeft; }
      .glass-card.from-right { animation-name: slideInRight; }
      .glass-card.from-top { animation-name: slideInTop; }
      .glass-card.from-bottom { animation-name: slideInBottom; }
      .glass-card.from-fade { animation-name: fadeScaleIn; }
      .glass-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 20px 50px ${hexAlpha(theme.primary, "45")}, 0 6px 22px ${hexAlpha(theme.accent, "2c")};
        border-color: ${hexAlpha(theme.primary, "9c")};
      }

      .nav-pill {
        position: relative; border: none; cursor: pointer; padding: 10px 20px; border-radius: 999px;
        font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13.5px;
        display: flex; align-items: center; gap: 8px; color: ${C.muted}; background: transparent;
        transition: color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, transform 0.25s ${ELASTIC};
        white-space: nowrap;
      }
      .nav-pill.active {
        color: #fff; background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 20px ${hexAlpha(theme.primary, "70")};
      }
      .nav-pill:not(.active):hover { color: ${C.text}; background: rgba(255,255,255,0.08); transform: translateY(-2px); }

      .icon-btn {
        border-radius: 50%; border: 1px solid ${C.glassBorder}; background: rgba(255,255,255,0.05);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform 0.25s ${ELASTIC}, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease; color: ${C.text};
        position: relative;
      }
      .icon-btn:hover { transform: rotate(50deg) scale(1.14) translateY(-2px); border-color: ${hexAlpha(theme.accent, "90")}; box-shadow: 0 6px 18px ${hexAlpha(theme.accent, "40")}; }
      .icon-btn.bell-btn:hover, .icon-btn.info-btn:hover { transform: scale(1.14) translateY(-2px) rotate(0deg); }

      .badge-dot {
        position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 999px;
        background: ${C.red}; color: #fff; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 2px rgba(10,1,24,0.9), 0 2px 8px rgba(251,113,133,0.6); animation: badgeDotPop 0.4s ${ELASTIC} both; pointer-events: none;
      }

      .lift-btn {
        transition: transform 0.25s ${ELASTIC}, box-shadow 0.3s ease, filter 0.3s ease;
      }
      .lift-btn:hover { transform: translateY(-5px) scale(1.02); filter: brightness(1.08); }
      .lift-btn:active { transform: translateY(-1px) scale(0.98); }

      .circle-btn {
        border-radius: 50%; border: 1px solid ${C.glassBorder}; background: rgba(255,255,255,0.03);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: transform 0.22s ${ELASTIC}, box-shadow 0.25s ease, background 0.4s ease, border-color 0.4s ease;
      }
      .circle-btn:hover { transform: scale(1.22); border-color: ${hexAlpha(theme.accent, "b0")}; box-shadow: 0 0 14px ${hexAlpha(theme.accent, "70")}; background: ${hexAlpha(theme.accent, "22")}; }
      .circle-btn.checked {
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent}); border-color: transparent;
        box-shadow: 0 0 14px ${hexAlpha(theme.primary, "a6")};
      }
      .circle-btn.checked:hover { box-shadow: 0 0 22px ${hexAlpha(theme.primary, "d0")}; }
      .circle-btn.pulse { animation: cellPulse 0.5s ease; }
      .dot-pop { animation: dotPop 0.45s ${ELASTIC}; }

      .bar-fill { transition: width 1s ${SMOOTH}; }

      .bg-base { position: fixed; inset: 0; z-index: 0; transition: background 0.5s ease; }
      .bg-gradient-layer {
        position: fixed; inset: -10%; z-index: 0; pointer-events: none;
        background: radial-gradient(circle at 20% 25%, ${hexAlpha(theme.primary, "42")}, transparent 55%),
                    radial-gradient(circle at 80% 70%, ${hexAlpha(theme.accent, "38")}, transparent 55%),
                    radial-gradient(circle at 50% 100%, ${hexAlpha(C.pink, "24")}, transparent 60%);
        background-size: 200% 200%; animation: gradientDrift 20s ease-in-out infinite;
        transition: background 0.5s ease;
      }
      .bg-image-layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-size: cover; background-position: center; transition: opacity 0.5s ease; }
      .glow-blob { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: blobDrift 14s ease-in-out infinite; transition: background 0.5s ease; }
      .particle { position: fixed; bottom: -20px; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(1px); animation: particleFloat linear infinite; transition: background 0.5s ease; }

      .credit-widget a { transition: transform 0.2s ${ELASTIC}, color 0.3s ease; }
      .credit-widget a:hover { transform: translateX(4px) scale(1.03); color: ${theme.accent}; }
      .credit-logo { animation: pulseGlow 2.6s ease-in-out infinite; }

      .habit-app select, .habit-app input, .habit-app textarea { color: ${C.text}; font-family: 'Inter', sans-serif; }
      .habit-app select option { background: #1a1030; color: ${C.text}; }
      .habit-app input[type="color"] { -webkit-appearance: none; border: none; background: none; width: 34px; height: 34px; padding: 0; cursor: pointer; border-radius: 10px; overflow: hidden; transition: transform 0.25s ${ELASTIC}; }
      .habit-app input[type="color"]:hover { transform: scale(1.1); }
      .habit-app input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
      .habit-app input[type="color"]::-webkit-color-swatch { border: 1px solid ${C.glassBorder}; border-radius: 10px; }

      .habit-app ::-webkit-scrollbar { width: 8px; height: 8px; }
      .habit-app ::-webkit-scrollbar-thumb { background: ${hexAlpha(theme.primary, "59")}; border-radius: 8px; transition: background 0.4s ease; }
      .habit-app ::-webkit-scrollbar-track { background: transparent; }

      .login-input:focus, .habit-app textarea:focus, .habit-app input:focus { outline: 2px solid ${hexAlpha(theme.accent, "80")}; outline-offset: 1px; }
      .habit-app textarea, .habit-app input { transition: border-color 0.3s ease, background 0.3s ease; }

      .water-drop { transition: transform 0.22s ${ELASTIC}, filter 0.25s ease; cursor: pointer; }
      .water-drop:hover { transform: scale(1.28) translateY(-3px); filter: drop-shadow(0 4px 10px ${hexAlpha(theme.accent, "70")}); }

      .journal-entry { transition: transform 0.22s ${ELASTIC}, background 0.3s ease, border-color 0.3s ease; cursor: pointer; }
      .journal-entry:hover { transform: translateX(4px); background: rgba(255,255,255,0.06); border-color: ${hexAlpha(theme.accent, "70")}; }
      .journal-entry.active { border-color: ${hexAlpha(theme.primary, "90")}; background: ${hexAlpha(theme.primary, "18")}; }

      .badge-tile { transition: transform 0.25s ${ELASTIC}, box-shadow 0.3s ease, opacity 0.3s ease, background 0.4s ease, border-color 0.4s ease; }
      .badge-tile:hover { transform: translateY(-4px) scale(1.05); }
      .badge-pop { animation: popIn 0.5s ${ELASTIC} both; }

      .confetti-piece { position: fixed; top: -20px; pointer-events: none; z-index: 999; animation: confettiFall linear forwards; }

      .glow-sweep { position: fixed; inset: 0; z-index: 998; pointer-events: none; animation: glowSweep 1.6s ease forwards; }

      .lang-btn {
        flex: 1; text-align: center; padding: 7px 0; border-radius: 10px; font-size: 12px; font-weight: 700;
        cursor: pointer; border: 1px solid ${C.glassBorder}; background: rgba(255,255,255,0.04); color: ${C.muted};
        transition: all 0.3s ease;
      }
      .lang-btn.active { color: #fff; background: linear-gradient(135deg, ${theme.primary}, ${theme.accent}); border-color: transparent; box-shadow: 0 4px 14px ${hexAlpha(theme.primary, "50")}; }

      .event-card { transition: transform 0.22s ${ELASTIC}, background 0.3s ease, border-color 0.3s ease; }
      .event-card:hover { transform: translateY(-2px); border-color: ${hexAlpha(theme.accent, "70")}; }

      .scroll-box { position: relative; }
      .scroll-hint {
        position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%);
        width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        background: ${hexAlpha(theme.primary, "cc")}; color: #fff; pointer-events: none;
        animation: bounceDown 1.4s ease-in-out infinite; box-shadow: 0 4px 12px ${hexAlpha(theme.primary, "60")};
      }
      .food-btn {
        flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 0;
        border-radius: 14px; cursor: pointer; font-weight: 700; font-size: 12px; border: 1px solid ${C.glassBorder};
        transition: transform 0.22s ${ELASTIC}, box-shadow 0.3s ease, filter 0.3s ease;
      }
      .food-btn:hover { transform: translateY(-4px) scale(1.03); }
      .food-btn:active { transform: translateY(-1px) scale(0.98); }

      .quote-text { animation: quoteFade 0.4s ease both; }
      .next-quote-btn {
        display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: #fff;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent}); border: none; border-radius: 999px;
        padding: 7px 14px; cursor: pointer; box-shadow: 0 4px 14px ${hexAlpha(theme.primary, "50")};
      }

      .notif-item { border-radius: 12px; border: 1px solid ${C.glassBorder}; padding: 10px; transition: transform 0.2s ${ELASTIC}, border-color 0.3s ease; }
      .notif-item:hover { transform: translateX(3px); border-color: ${hexAlpha(theme.accent, "70")}; }

      .modal-overlay {
        position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center;
        background: rgba(5,0,14,0.68); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        animation: overlayIn 0.25s ease both; padding: 20px;
      }
      .modal-box {
        animation: modalIn 0.3s ${ELASTIC} both;
      }
      .modal-close-btn {
        width: 32px; height: 32px; border-radius: 50%; border: 1px solid ${C.glassBorder}; background: rgba(255,255,255,0.06);
        color: ${C.text}; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 0.25s ${ELASTIC}, background 0.3s ease, border-color 0.3s ease;
      }
      .modal-close-btn:hover { transform: rotate(90deg) scale(1.1); background: ${hexAlpha(C.red, "22")}; border-color: ${hexAlpha(C.red, "80")}; }

      .about-info-btn, .info-btn-fixed {
        width: 38px; height: 38px; border-radius: 50%; border: 1px solid ${hexAlpha(theme.accent, "70")};
        background: linear-gradient(135deg, ${hexAlpha(theme.primary, "cc")}, ${hexAlpha(theme.accent, "cc")});
        color: #fff; font-weight: 800; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 3px ${hexAlpha(theme.primary, "14")}, 0 6px 20px ${hexAlpha(theme.primary, "50")};
        transition: transform 0.25s ${ELASTIC}, box-shadow 0.3s ease;
        flex-shrink: 0;
      }
      .about-info-btn:hover, .info-btn-fixed:hover { transform: scale(1.12) rotate(-6deg); box-shadow: 0 0 0 6px ${hexAlpha(theme.primary, "22")}, 0 10px 26px ${hexAlpha(theme.primary, "70")}; }

      .dice-roll-btn {
        width: 88px; height: 88px; border-radius: 26px; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        box-shadow: 0 10px 30px ${hexAlpha(theme.primary, "60")};
        transition: transform 0.22s ${ELASTIC}, box-shadow 0.3s ease;
      }
      .dice-roll-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 38px ${hexAlpha(theme.primary, "80")}; }
      .dice-roll-btn:active { transform: translateY(0) scale(0.97); }
      .dice-roll-btn.rolling { animation: diceSpin 0.5s linear infinite; }
      .dice-roll-btn:disabled { cursor: default; }
      .dice-result { animation: resultPop 0.4s ${ELASTIC} both; }
      .diff-btn {
        flex: 1; padding: 9px 0; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 12.5px;
        border: 1px solid ${C.glassBorder}; background: rgba(255,255,255,0.04); color: ${C.muted};
        transition: transform 0.2s ${ELASTIC}, background 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .diff-btn:hover { transform: translateY(-2px); }
      .diff-btn.active { color: #0a0118; }

      /* ---- routines ---- */
      .routine-card {
        border-radius: 18px; border: 1px solid ${C.glassBorder}; padding: 14px; position: relative; overflow: hidden;
        background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
        transition: transform 0.25s ${ELASTIC}, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .routine-card:hover { transform: translateY(-4px); border-color: ${hexAlpha(theme.accent, "80")}; box-shadow: 0 14px 34px ${hexAlpha(theme.primary, "30")}; }
      .routine-cat-pill {
        font-size: 9.5px; font-weight: 800; letter-spacing: 0.3px; padding: 3px 9px; border-radius: 999px; display: inline-flex;
      }
      .routine-action-btn {
        flex: 1; padding: 8px 0; border-radius: 11px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
        transition: transform 0.2s ${ELASTIC}, filter 0.2s ease, box-shadow 0.2s ease;
      }
      .routine-action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
      .routine-feedback { font-size: 11px; font-weight: 700; animation: feedbackPop 0.3s ${ELASTIC} both; }

      /* ---- goals ---- */
      .goal-card {
        border-radius: 18px; border: 1px solid ${C.glassBorder}; padding: 14px; position: relative; overflow: hidden;
        background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
        transition: transform 0.25s ${ELASTIC}, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .goal-card:hover { transform: translateY(-4px); border-color: ${hexAlpha(theme.primary, "80")}; box-shadow: 0 14px 34px ${hexAlpha(theme.accent, "26")}; }
      .goal-progress-track { height: 10px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; position: relative; }
      .goal-progress-fill { height: 100%; border-radius: 999px; transition: width 0.8s ${SMOOTH}; }
      .goal-slider { width: 100%; accent-color: ${theme.accent}; cursor: pointer; }
      .goal-achieved-badge {
        display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; color: #0a0118;
        background: linear-gradient(135deg, ${C.amber}, ${theme.accent}); padding: 3px 9px; border-radius: 999px;
      }
    `}</style>
  );
}

/* ============================================================================
   SMALL ATOMS
============================================================================ */

function GlassCard({ title, icon, children, style, delay = 0, from = "fade", className = "" }) {
  return (
    <div className={`glass-card from-${from} ${className}`} style={{ padding: 16, animationDelay: `${delay}ms`, position: "relative", zIndex: 1, ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, letterSpacing: 0.2, color: C.text, marginBottom: 12 }}>
          {icon}{title}
        </div>
      )}
      {children}
    </div>
  );
}

/* Scrollable list wrapper: fixed max height + auto scrollbar + a small bouncing
   arrow hint that only appears while there's more content below the fold. */
function ScrollBox({ maxHeight = 220, children, style }) {
  const ref = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function check() {
      setOverflowing(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
    }
    check();
    el.addEventListener("scroll", check);
    const obs = new ResizeObserver(check);
    obs.observe(el);
    return () => { el.removeEventListener("scroll", check); obs.disconnect(); };
  }, [children]);

  return (
    <div className="scroll-box">
      <div ref={ref} style={{ maxHeight, overflowY: "auto", paddingRight: 4, ...style }}>
        {children}
      </div>
      {overflowing && (
        <div className="scroll-hint">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      )}
    </div>
  );
}

function AnimatedBar({ pct, primary, accent }) {
  const [w, setW] = useState(0);
  useEffect(() => { setW(0); const t = setTimeout(() => setW(pct), 100); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
      <div className="bar-fill" style={{ width: `${w}%`, height: "100%", background: `linear-gradient(90deg, ${primary}, ${accent})`, borderRadius: 6 }} />
    </div>
  );
}

function DotPicker({ value, max = 10, color, onSelect, poppedIndex }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: max }, (_, i) => {
          const filled = !!value && i < value;
          const popped = poppedIndex === i;
          return (
            <button key={i} onClick={() => onSelect(i + 1)} title={String(i + 1)} className={`circle-btn ${popped ? "dot-pop" : ""}`}
              style={{ width: 14, height: 14, background: filled ? color : "rgba(255,255,255,0.04)", borderColor: filled ? color : C.glassBorder, boxShadow: filled ? `0 0 8px ${color}` : "none", flexShrink: 0 }} />
          );
        })}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: value ? C.text : C.muted, minWidth: 14, textAlign: "right" }}>{value || "–"}</span>
    </div>
  );
}

/* ============================================================================
   BACKGROUND
============================================================================ */

function AnimatedBackground({ theme, particles }) {
  return (
    <>
      <div className="bg-base" style={{ background: `linear-gradient(160deg, ${theme.background} 0%, ${shade(theme.background, 14)} 45%, ${shade(theme.background, 26)} 100%)` }} />
      {theme.backgroundImage && theme.backgroundImageTarget !== "journal" && (
        <div className="bg-image-layer" style={{ backgroundImage: `url(${theme.backgroundImage})`, opacity: 0.32 }} />
      )}
      <div className="bg-gradient-layer" />
      <div className="glow-blob" style={{ top: -80, left: -60, width: 340, height: 340, background: theme.primary, opacity: 0.24 }} />
      <div className="glow-blob" style={{ top: 200, right: -100, width: 400, height: 400, background: theme.accent, opacity: 0.18, animationDelay: "-4s" }} />
      <div className="glow-blob" style={{ bottom: -100, left: "40%", width: 320, height: 320, background: C.pink, opacity: 0.14, animationDelay: "-9s" }} />
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.colorIdx === 0 ? theme.primary : theme.accent, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, boxShadow: `0 0 6px ${p.colorIdx === 0 ? theme.primary : theme.accent}` }} />
      ))}
    </>
  );
}

/* ============================================================================
   CONFETTI
============================================================================ */

function Confetti({ pieces }) {
  if (!pieces || pieces.length === 0) return null;
  return (
    <>
      <div className="glow-sweep" style={{ background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.18), transparent 60%)" }} />
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, width: p.size, height: p.size * (p.round ? 1 : 1.7),
          background: p.color, borderRadius: p.round ? "50%" : "3px",
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </>
  );
}

/* ============================================================================
   LOGIN SCREEN
============================================================================ */

function LoginScreen({ theme, particles, onLogin, t }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) { setErr(true); return; }
    onLogin(trimmed);
  }

  return (
    <div className="habit-app" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "hidden" }}>
      <GlobalStyles theme={theme} />
      <AnimatedBackground theme={theme} particles={particles} />
      <div className="glass-card from-fade" style={{ position: "relative", zIndex: 1, width: 340, maxWidth: "100%", padding: 32, textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18, margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: `0 0 26px ${hexAlpha(theme.primary, "80")}`,
        }}>
          <Sparkles size={26} color="#fff" />
        </div>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: C.text }}>{t("welcomeBack")}</h1>
        <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 22px", lineHeight: 1.5 }}>
          {t("loginSub")}
        </p>
        <input
          className="login-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("firstNamePlaceholder")}
          autoFocus
          style={{
            width: "100%", fontSize: 14, padding: "11px 14px", borderRadius: 14, textAlign: "center",
            border: `1px solid ${err ? C.red : C.glassBorder}`, background: "rgba(255,255,255,0.06)", marginBottom: 8,
          }}
        />
        {err && <div style={{ fontSize: 11, color: C.red, marginBottom: 10 }}>{t("pleaseEnterName")}</div>}
        <button
          onClick={submit}
          className="lift-btn"
          style={{
            width: "100%", marginTop: 10, padding: "11px 0", borderRadius: 14, border: "none", cursor: "pointer",
            fontSize: 13.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            boxShadow: `0 6px 22px ${hexAlpha(theme.primary, "60")}`,
          }}
        >
          {t("login")}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   SETTINGS PANEL
============================================================================ */

function SettingsPanel({ theme, onChange, onReset, onClose, t, lang, setLang }) {
  const fileInputRef = useRef(null);
  const [urlDraft, setUrlDraft] = useState(theme.backgroundImage || "");

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { onChange("backgroundImage", reader.result); setUrlDraft(reader.result); };
    reader.readAsDataURL(file);
  }

  return (
    <GlassCard from="fade" delay={0} style={{ position: "fixed", top: 62, right: 16, zIndex: 95, width: 250, animationDuration: "0.3s", maxHeight: "80vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{t("settings")}</span>
        <button onClick={onClose} className="lift-btn" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><X size={15} /></button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, marginBottom: 8 }}>
          <Globe size={13} /> {t("language")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`lang-btn ${lang === "de" ? "active" : ""}`} onClick={() => setLang("de")}>Deutsch</button>
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>English</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
        {[{ key: "primary", label: t("primaryColor") }, { key: "accent", label: t("accentColor") }, { key: "background", label: t("backgroundColor") }].map((row) => (
          <div key={row.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.muted }}>{row.label}</span>
            <input type="color" value={theme[row.key]} onChange={(e) => onChange(row.key, e.target.value)} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14, paddingTop: 12, borderTop: `1px solid ${C.glassBorder}` }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{t("backgroundImage")}</div>
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onBlur={() => onChange("backgroundImage", urlDraft.trim())}
          onKeyDown={(e) => e.key === "Enter" && onChange("backgroundImage", urlDraft.trim())}
          placeholder={t("backgroundImageUrlPlaceholder")}
          style={{ width: "100%", fontSize: 11.5, padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)", marginBottom: 8 }}
        />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="lift-btn" style={{ flex: 1, fontSize: 11, color: C.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, borderRadius: 10, padding: "7px 0", cursor: "pointer" }}>
            {t("uploadImage")}
          </button>
          {theme.backgroundImage && (
            <button onClick={() => { onChange("backgroundImage", ""); setUrlDraft(""); }} className="lift-btn" style={{ fontSize: 11, color: C.red, background: "rgba(251,113,133,0.1)", border: `1px solid ${C.red}`, borderRadius: 10, padding: "7px 10px", cursor: "pointer" }}>
              <X size={12} />
            </button>
          )}
        </div>
        {theme.backgroundImage && (
          <>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <button className={`lang-btn ${theme.backgroundImageTarget !== "journal" ? "active" : ""}`} onClick={() => onChange("backgroundImageTarget", "dashboard")} style={{ fontSize: 10.5 }}>
                {t("bgTargetDashboard")}
              </button>
              <button className={`lang-btn ${theme.backgroundImageTarget === "journal" ? "active" : ""}`} onClick={() => onChange("backgroundImageTarget", "journal")} style={{ fontSize: 10.5 }}>
                {t("bgTargetJournal")}
              </button>
            </div>
            <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.glassBorder}`, height: 60, backgroundImage: `url(${theme.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </>
        )}
      </div>

      <button onClick={onReset} className="lift-btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11.5, color: C.muted, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.glassBorder}`, borderRadius: 10, padding: "7px 0", cursor: "pointer" }}>
        <RotateCcw size={12} /> {t("reset")}
      </button>
    </GlassCard>
  );
}

/* ============================================================================
   NOTIFICATIONS PANEL — sits below the settings gear, shows upcoming events
============================================================================ */

function NotificationsPanel({ theme, events, onToggleDone, onClose, t }) {
  const sorted = useMemo(
    () => [...events].sort((a, b) => `${a.date}T${a.time || "00:00"}`.localeCompare(`${b.date}T${b.time || "00:00"}`)),
    [events]
  );

  return (
    <GlassCard from="fade" delay={0} style={{ position: "fixed", top: 112, right: 16, zIndex: 95, width: 280, animationDuration: "0.3s", maxHeight: "70vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700 }}><Bell size={14} color={theme.accent} />{t("notifications")}</span>
        <button onClick={onClose} className="lift-btn" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><X size={15} /></button>
      </div>

      {sorted.length === 0 ? (
        <div style={{ fontSize: 12, color: C.muted }}>{t("noUpcomingEvents")}</div>
      ) : (
        <ScrollBox maxHeight={380}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorted.map((ev) => {
              const done = ev.done || isEventPast(ev);
              const dueSoon = !done && isDueSoon(ev);
              return (
                <div key={ev.id} className="notif-item" style={{ background: dueSoon ? hexAlpha(C.amber, "14") : "rgba(255,255,255,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{ev.date}{ev.time ? ` · ${ev.time}` : ""}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4, color: done ? C.green : (dueSoon ? C.amber : C.muted) }}>
                        {done ? t("completedBadge") : (dueSoon ? t("dueSoon") : t("upcoming"))}
                      </div>
                    </div>
                    {!done && (
                      <button onClick={() => onToggleDone(ev.id)} title={t("markDone")} className="icon-btn" style={{ width: 26, height: 26, flexShrink: 0 }}>
                        <CheckCircle2 size={13} color={C.muted} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollBox>
      )}
    </GlassCard>
  );
}

/* ============================================================================
   ABOUT / MANIFESTO — text lives only inside the modal, never as a page block
============================================================================ */

const MANIFESTO = {
  de: `Die Idee zu dieser Website entstand nicht aus einem Business Plan heraus, sondern aus einem Moment der Stille, der mich tief berührte. Ich scrollte durch Instagram und sah einen jungen Mann, der in einem einfachen Heft seine täglichen Fortschritte festhielt. Er zeichnete Diagramme, notierte seine Gewohnheiten und schuf sich so sein eigenes kleines Dashboard, genau wie ich es auf meiner Website umgesetzt habe. Doch was mich wirklich traf, war nicht seine Disziplin, sondern das, was ich um ihn herum sah.

Überall auf dieser Plattform wurde genau dieses System verkauft. Menschen, die sich nichts anderes wünschten, als ein wenig Ordnung in ihren Alltag zu bringen, sollten dafür bezahlen. Und das oft mit Geld, das sie nicht hatten.

Ich erinnerte mich an Momente, in denen ich selbst nicht wusste, wie ich mir etwas leisten sollte. An Tage, an denen ich meinen Eltern keine weiteren Wünsche stellen wollte, weil sie schon so viel gaben, obwohl sie selbst kämpften. Ich erinnerte mich an dieses Gefühl der Ohnmacht, wenn man etwas wirklich braucht, sei es für die eigene Gesundheit, für den Geist oder einfach für das Gefühl, nicht allein zu sein, und es dann doch nicht bekommt, weil der Preis eine unüberwindbare Hürde ist.

Genau dieses Gefühl möchte ich mit meiner Website niemandem mehr zumuten.

Ich habe diese Seite programmiert, weil ich glaube, dass die Arbeit an sich selbst kein Luxus sein darf. Sich um seine Gewohnheiten zu kümmern, seine Stimmung zu reflektieren, Fortschritte zu sehen, das sind grundlegende Bedürfnisse, keine Premium Features. Jeder Mensch verdient die Chance, sein Leben ein Stück besser zu gestalten, ohne dass ihm dafür ein finanzieller Stein in den Weg gelegt wird.

Ich verstehe den Schmerz, wenn man etwas möchte, aber nicht bekommt, weil das Geld fehlt. Ich verstehe die Enttäuschung, wenn man sich nach Struktur sehnt, aber nur bezahlte Angebote findet. Und ich verstehe die Demütigung, wenn man in einer Welt lebt, in der gefühlt alles einen Preis hat, nur nicht das eigene Wohlbefinden.

Deshalb habe ich mich entschieden: Diese Website bleibt für immer kostenlos. Sie ist für alle da, die sich auf den Weg machen wollen, ohne dass jemand an der Kasse steht. Sie ist ein kleines Geschenk an all diejenigen, die genau wissen, wie es sich anfühlt, wenn man sich etwas nicht kaufen kann, obwohl man es so sehr braucht.

Meine Website ist kein Produkt. Sie ist eine Einladung an jeden, der sich traut, den ersten Schritt zu machen, ohne Angst haben zu müssen, dass der zweite Schritt etwas kostet.`,
  en: `The idea for this website did not come from a business plan, but from a moment of silence that deeply touched me. I was scrolling through Instagram and saw a young man tracking his daily progress in a simple notebook. He drew charts, noted his habits, and created his own little dashboard, just like I have implemented on my website. But what really struck me was not his discipline, but what I saw around him.

Everywhere on this platform, exactly this system was being sold. People who wanted nothing more than to bring a little order into their daily lives were supposed to pay for it. And often with money they didn't have.

I remembered moments when I myself didn't know how to afford something. Days when I didn't want to ask my parents for anything else, because they already gave so much, even though they were struggling themselves. I remembered that feeling of helplessness when you really need something – for your own health, for your mind, or simply for the feeling of not being alone – and then you can't get it because the price is an insurmountable hurdle.

That is exactly the feeling I don't want to put on anyone anymore with my website.

I programmed this page because I believe that working on yourself should not be a luxury. Taking care of your habits, reflecting on your mood, seeing progress – these are basic needs, not premium features. Everyone deserves the chance to make their life a little better without having a financial stone put in their way.

I understand the pain of wanting something but not getting it because you lack the money. I understand the disappointment of longing for structure but only finding paid offers. And I understand the humiliation of living in a world where seemingly everything has a price, except your own well-being.

That is why I have decided: This website will remain free forever. It is for everyone who wants to start their journey without someone standing at the cash register. It is a small gift to all those who know exactly what it feels like when you cannot buy something even though you need it so badly.

My website is not a product. It is an invitation to anyone who dares to take the first step without having to be afraid that the second step will cost something.`,
};

function AboutModal({ theme, t, lang, onClose }) {
  const paragraphs = (MANIFESTO[lang] || MANIFESTO.de).split("\n\n");
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box glass-card" style={{ padding: 26, width: 480, maxWidth: "100%", maxHeight: "82vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: `0 0 18px ${hexAlpha(theme.primary, "60")}`,
            }}>
              <Info size={18} color="#fff" />
            </div>
            <h2 className="display" style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text }}>{t("aboutPopupTitle")}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" title={t("closeButton")}>
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, margin: 0 }}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MOTIVATION, QUOTE, JOURNAL, WATER, BADGES, FOOD
============================================================================ */

function MotivationCard({ theme, delay, from, t, lang }) {
  const [topic, setTopic] = useState("");
  const tips = useMemo(() => getTips(topic, lang), [topic, lang]);
  return (
    <GlassCard title={t("motivationTips")} icon={<Sparkles size={14} color={theme.accent} />} delay={delay} from={from}>
      <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t("topicPlaceholder")}
        style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)", marginBottom: 12 }} />
      {tips.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tips.map((tip, i) => (
            <div key={tip} style={{ fontSize: 12.5, lineHeight: 1.5, padding: "9px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}`, animation: "fadeScaleIn 0.35s ease both", animationDelay: `${i * 80}ms` }}>
              {tip}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: C.muted }}>{t("topicEmptyHint")}</div>
      )}
    </GlassCard>
  );
}

/* Quote of the day: auto-rotates every 10 minutes and supports a manual "Next" click.
   The quote index is persisted (via parent state) so it survives tab switches within a session. */
function QuoteCard({ theme, delay, from, t, lang, quoteIndex, onNext }) {
  const list = lang === "en" ? QUOTES_EN : QUOTES;
  const quote = list[quoteIndex % list.length];
  return (
    <GlassCard title={t("quoteOfDay")} icon={<Quote size={14} color={theme.accent} />} delay={delay} from={from}>
      <div key={quoteIndex} className="quote-text">
        <div style={{ fontSize: 14, lineHeight: 1.6, fontStyle: "italic", color: C.text, marginBottom: 8 }}>„{quote.text}"</div>
        <div style={{ fontSize: 11.5, color: C.muted, textAlign: "right", marginBottom: 14 }}>— {quote.author}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onNext} className="next-quote-btn lift-btn">
          {t("nextQuote")} <ChevronRight size={14} />
        </button>
      </div>
    </GlassCard>
  );
}

/* Journal: user gives every entry its own title. Title + text clear right after saving,
   the saved entry is appended to the list below (which has a fixed height + scroll). */
function JournalCard({ theme, delay, from, entries, title, text, error, onTitleChange, onTextChange, onSave, t, fullDateTimeLabel, expandedId, onToggleExpand }) {
  const bgStyle = theme.backgroundImage && theme.backgroundImageTarget === "journal"
    ? { backgroundImage: `linear-gradient(rgba(10,1,24,0.72), rgba(10,1,24,0.72)), url(${theme.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 22 }
    : {};
  return (
    <GlassCard title={t("journal")} icon={<NotebookPen size={14} color={theme.accent} />} delay={delay} from={from} style={bgStyle}>
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={t("journalTitlePlaceholder")}
        style={{ width: "100%", fontSize: 13, fontWeight: 700, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)", marginBottom: 8 }}
      />
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={t("journalPlaceholder")}
        rows={5}
        style={{ width: "100%", fontSize: 12.5, lineHeight: 1.5, padding: "10px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)", resize: "vertical" }}
      />
      {error && <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>{error}</div>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 8, marginBottom: 14 }}>
        <button onClick={onSave} className="lift-btn" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer",
          boxShadow: `0 4px 14px ${hexAlpha(theme.primary, "50")}`,
        }}>
          <Save size={13} /> {t("save")}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 8 }}>
        <Clock size={12} /> {t("earlierEntries")}
      </div>
      {entries.length === 0 ? (
        <div style={{ fontSize: 11.5, color: C.muted }}>{t("noSavedEntries")}</div>
      ) : (
        <ScrollBox maxHeight={220}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((entry) => {
              const open = expandedId === entry.id;
              return (
                <div key={entry.id} onClick={() => onToggleExpand(entry.id)} className={`journal-entry ${open ? "active" : ""}`}
                  style={{ borderRadius: 12, border: `1px solid ${C.glassBorder}`, padding: "8px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.title}</span>
                  </div>
                  <div style={{ fontSize: 10, color: theme.accent, marginTop: 2 }}>{fullDateTimeLabel(entry.timestamp || entry.date)}</div>
                  <div style={{
                    fontSize: 11, color: C.muted, marginTop: 4,
                    overflow: open ? "visible" : "hidden",
                    textOverflow: open ? "clip" : "ellipsis",
                    whiteSpace: open ? "pre-wrap" : "nowrap",
                  }}>
                    {entry.text}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollBox>
      )}
    </GlassCard>
  );
}

function WaterCard({ theme, delay, from, water, onSet, t, dayLabel, fullDateTimeLabel }) {
  const key = todayStr();
  const count = water[key] || 0;
  const history = useMemo(
    () => Object.keys(water).filter((k) => k !== key && water[k] > 0).sort().reverse(),
    [water, key]
  );
  return (
    <GlassCard title={t("water")(dayLabel(key))} icon={<Droplet size={14} color={theme.accent} />} delay={delay} from={from}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {Array.from({ length: 8 }, (_, i) => {
          const filled = i < count;
          return (
            <div key={i} className="water-drop" onClick={() => onSet(key, i < count ? i : i + 1)} title={`${i + 1}`}>
              <Droplet size={26} color={filled ? theme.accent : "rgba(255,255,255,0.15)"} fill={filled ? theme.accent : "none"} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: history.length ? 10 : 0 }}>{count} / 8 {t("glasses")}</div>
      {history.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 6 }}>{t("waterHistory")}</div>
          <ScrollBox maxHeight={140}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {history.map((k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, padding: "5px 8px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.glassBorder}` }}>
                  <span style={{ color: C.muted }}>{dayLabel(k)}</span>
                  <span style={{ color: theme.accent, fontWeight: 700 }}>{water[k]} / 8</span>
                </div>
              ))}
            </div>
          </ScrollBox>
        </>
      )}
    </GlassCard>
  );
}

function BadgesCard({ theme, delay, from, unlocked, t, lang }) {
  return (
    <GlassCard title={t("badges")} icon={<Award size={14} color={theme.accent} />} delay={delay} from={from}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 10 }}>
        {BADGE_DEFS.map((b, i) => {
          const on = unlocked.has(b.id);
          const loc = b[lang] || b.de;
          return (
            <div key={b.id} title={loc.desc} className={`badge-tile ${on ? "badge-pop" : ""}`} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 6px", borderRadius: 14,
              background: on ? hexAlpha(theme.primary, "1c") : "rgba(255,255,255,0.03)",
              border: `1px solid ${on ? hexAlpha(theme.primary, "70") : C.glassBorder}`,
              opacity: on ? 1 : 0.4, animationDelay: `${i * 60}ms`,
            }}>
              <span style={{ fontSize: 22 }}>{b.icon}</span>
              <span style={{ fontSize: 9.5, textAlign: "center", color: on ? C.text : C.muted, fontWeight: 600, lineHeight: 1.2 }}>{loc.label}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* Healthy / unhealthy food tracker: log a meal with one tap, see a bar chart of
   this week's split, and get an automatic warning once unhealthy meals pile up. */
function FoodTrackerCard({ theme, delay, from, meals, onLog, t }) {
  const weekAgo = Date.now() - 7 * 86400000;
  const weekMeals = useMemo(() => meals.filter((m) => m.timestamp >= weekAgo), [meals, weekAgo]);
  const healthyCount = weekMeals.filter((m) => m.type === "healthy").length;
  const unhealthyCount = weekMeals.filter((m) => m.type === "unhealthy").length;
  const chartData = [
    { label: t("healthy"), value: healthyCount, fill: C.green },
    { label: t("unhealthy"), value: unhealthyCount, fill: C.red },
  ];
  const warn = unhealthyCount > 3;

  return (
    <GlassCard title={t("foodTracker")} icon={<Scale size={14} color={theme.accent} />} delay={delay} from={from}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={() => onLog("healthy")} className="food-btn" style={{ background: hexAlpha(C.green, "1c"), borderColor: hexAlpha(C.green, "60"), color: C.green, padding: "12px 0" }}>
          <span style={{ fontSize: 20 }}>🥗</span>{t("ateHealthy")}
        </button>
        <button onClick={() => onLog("unhealthy")} className="food-btn" style={{ background: hexAlpha(C.red, "1c"), borderColor: hexAlpha(C.red, "60"), color: C.red, padding: "12px 0" }}>
          <span style={{ fontSize: 20 }}>🍔</span>{t("ateUnhealthy")}
        </button>
      </div>

      {warn && (
        <div style={{ fontSize: 12, color: C.red, background: "rgba(251,113,133,0.12)", border: `1px solid ${C.red}`, borderRadius: 12, padding: "9px 12px", marginBottom: 12, lineHeight: 1.5 }}>
          ⚠️ {t("foodWarning")}
        </div>
      )}

      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={chartData} margin={{ left: -10 }}>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis width={24} tick={{ fontSize: 9, fill: C.muted }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 11, background: "#1a1030", border: `1px solid ${C.glassBorder}`, borderRadius: 10 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out">
            {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", marginTop: 4 }}>{t("last7Days")}</div>
    </GlassCard>
  );
}

/* ============================================================================
   EVENTS TAB (Termine)
============================================================================ */

function emptyEventForm() {
  return { id: null, name: "", date: todayStr(), time: "", description: "" };
}

function EventsCard({ theme, events, onSave, onDelete, onToggleDone, t }) {
  const [form, setForm] = useState(emptyEventForm());
  const [editingId, setEditingId] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  function isPast(ev) {
    if (!ev.date) return false;
    const dt = new Date(`${ev.date}T${ev.time || "23:59"}:00`);
    return dt.getTime() < Date.now();
  }

  function startEdit(ev) {
    setForm({ id: ev.id, name: ev.name, date: ev.date, time: ev.time || "", description: ev.description || "" });
    setEditingId(ev.id);
    setErrMsg("");
  }
  function cancelEdit() {
    setForm(emptyEventForm());
    setEditingId(null);
    setErrMsg("");
  }
  function submit() {
    if (!form.name.trim() || !form.date) { setErrMsg(t("fillNameDate")); return; }
    onSave({ ...form, id: form.id || "ev" + Date.now() });
    cancelEdit();
  }

  const sorted = useMemo(
    () => [...events].sort((a, b) => `${a.date}T${a.time || "00:00"}`.localeCompare(`${b.date}T${b.time || "00:00"}`)),
    [events]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <GlassCard title={editingId ? t("editEvent") : t("newEvent")} icon={<CalendarDays size={14} color={theme.accent} />} from="top" delay={0}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("eventName")}</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t("eventNamePlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("eventDate")}</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("eventTime")}</label>
            <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("eventDescription")}</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={t("eventDescriptionPlaceholder")} rows={3}
              style={{ width: "100%", fontSize: 12.5, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)", resize: "vertical" }} />
          </div>
        </div>
        {errMsg && <div style={{ fontSize: 11.5, color: C.red, marginBottom: 8 }}>{errMsg}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={submit} className="lift-btn" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff",
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, border: "none", borderRadius: 10,
            padding: "9px 18px", cursor: "pointer", boxShadow: `0 4px 14px ${hexAlpha(theme.primary, "50")}`,
          }}>
            <Save size={13} /> {t("saveEvent")}
          </button>
          {editingId && (
            <button onClick={cancelEdit} className="lift-btn" style={{ fontSize: 12.5, color: C.muted, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.glassBorder}`, borderRadius: 10, padding: "9px 16px", cursor: "pointer" }}>
              {t("cancel")}
            </button>
          )}
        </div>
      </GlassCard>

      <GlassCard title={t("eventsTitle")} icon={<CalendarDays size={14} color={theme.accent} />} from="bottom" delay={100}>
        {sorted.length === 0 ? (
          <div style={{ fontSize: 12, color: C.muted }}>{t("noEvents")}</div>
        ) : (
          <ScrollBox maxHeight={420}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sorted.map((ev) => {
                const past = isPast(ev);
                const effectiveDone = ev.done || past;
                return (
                  <div key={ev.id} className="event-card" style={{
                    borderRadius: 14, border: `1px solid ${C.glassBorder}`, padding: "10px 12px",
                    background: effectiveDone ? "rgba(255,255,255,0.03)" : hexAlpha(theme.primary, "10"),
                    opacity: effectiveDone ? 0.7 : 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{ev.name}</span>
                          <span style={{
                            fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                            color: effectiveDone ? C.muted : theme.accent,
                            border: `1px solid ${effectiveDone ? C.glassBorder : hexAlpha(theme.accent, "70")}`,
                          }}>
                            {effectiveDone ? (ev.done ? t("past") : `${t("past")} (${t("autoCompleted")})`) : t("upcoming")}
                          </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>
                          {ev.date}{ev.time ? ` · ${ev.time}` : ""}
                        </div>
                        {ev.description && (
                          <div style={{ fontSize: 12, color: C.text, marginTop: 6, lineHeight: 1.5 }}>{ev.description}</div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => onToggleDone(ev.id)} title={ev.done ? t("markOpen") : t("markDone")} className="icon-btn" style={{ width: 30, height: 30 }}>
                          <CheckCircle2 size={14} color={ev.done ? theme.accent : C.muted} />
                        </button>
                        <button onClick={() => startEdit(ev)} title={t("edit")} className="icon-btn" style={{ width: 30, height: 30 }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => onDelete(ev.id)} title={t("delete")} className="icon-btn" style={{ width: 30, height: 30 }}>
                          <Trash2 size={13} color={C.red} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollBox>
        )}
      </GlassCard>
    </div>
  );
}

/* ============================================================================
   CHALLENGES TAB (Challenge-Würfel)
============================================================================ */

function ChallengesCard({ theme, difficulty, onSelectDifficulty, isRolling, rollingText, history, onRoll, onToggleDone, unlockedBadges, t, lang }) {
  const diffMeta = [
    { id: "leicht", label: t("diffEasy"), color: C.green },
    { id: "mittel", label: t("diffMedium"), color: C.amber },
    { id: "hard", label: t("diffHard"), color: C.red },
  ];
  const current = diffMeta.find((d) => d.id === difficulty);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <GlassCard title={t("challengeTitle")} icon={<Dices size={14} color={theme.accent} />} from="top" delay={0}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            {diffMeta.map((d) => (
              <button
                key={d.id}
                className={`diff-btn ${difficulty === d.id ? "active" : ""}`}
                style={difficulty === d.id ? { background: d.color, borderColor: d.color, boxShadow: `0 4px 14px ${hexAlpha(d.color, "60")}` } : {}}
                onClick={() => onSelectDifficulty(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button className={`dice-roll-btn ${isRolling ? "rolling" : ""}`} onClick={onRoll} disabled={isRolling} title={t("rollDice")}>
            <Dices size={36} color="#fff" />
          </button>

          <div style={{ minHeight: 60, textAlign: "center" }}>
            {isRolling ? (
              <div style={{ fontSize: 15, fontWeight: 700, color: C.muted }}>{rollingText || "…"}</div>
            ) : history.length > 0 ? (
              <div key={history[0].id} className="dice-result" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{history[0].text}</div>
                <button onClick={() => onToggleDone(history[0].id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  {history[0].done ? <CheckCircle2 size={20} color={current.color} /> : <Circle size={20} color={C.muted} />}
                  <span style={{ fontSize: 12, fontWeight: 600, color: history[0].done ? current.color : C.muted }}>
                    {history[0].done ? t("done") : t("markDoneChallenge")}
                  </span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: C.muted }}>{t("firstChallengeHint")}</div>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard title={t("badges")} icon={<Award size={14} color={theme.accent} />} from="left" delay={80}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 10 }}>
          {CHALLENGE_BADGE_DEFS.map((b) => {
            const on = unlockedBadges.has(b.id);
            const loc = b[lang] || b.de;
            return (
              <div key={b.id} title={loc.desc} className={`badge-tile ${on ? "badge-pop" : ""}`} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 6px", borderRadius: 14,
                background: on ? hexAlpha(theme.primary, "1c") : "rgba(255,255,255,0.03)",
                border: `1px solid ${on ? hexAlpha(theme.primary, "70") : C.glassBorder}`,
                opacity: on ? 1 : 0.4,
              }}>
                <span style={{ fontSize: 22 }}>{b.icon}</span>
                <span style={{ fontSize: 9.5, textAlign: "center", color: on ? C.text : C.muted, fontWeight: 600, lineHeight: 1.2 }}>{loc.label}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard title={t("challengeHistoryTitle")} icon={<Clock size={14} color={theme.accent} />} from="bottom" delay={140}>
        {history.length === 0 ? (
          <div style={{ fontSize: 12.5, color: C.muted }}>{t("noChallengesYet")}</div>
        ) : (
          <ScrollBox maxHeight={360}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((e) => {
                const diff = diffMeta.find((d) => d.id === e.difficulty);
                return (
                  <div key={e.id} className="event-card" style={{ borderRadius: 14, border: `1px solid ${C.glassBorder}`, padding: "10px 12px", background: e.done ? "rgba(255,255,255,0.03)" : hexAlpha(theme.primary, "0d") }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{e.text}</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: diff.color, border: `1px solid ${hexAlpha(diff.color, "70")}` }}>
                            {diff.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                          {t("rolledLabel")}: {formatChallengeDateTime(e.rolledAt, lang)}
                        </div>
                        <div style={{ fontSize: 11, marginTop: 2, fontWeight: 700, color: e.done ? diff.color : C.muted }}>
                          {e.done ? `✅ ${t("done")} · ${formatChallengeDateTime(e.doneAt, lang)}` : t("open")}
                        </div>
                      </div>
                      <button onClick={() => onToggleDone(e.id)} title={e.done ? t("markOpen") : t("markDoneChallenge")} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                        {e.done ? <CheckCircle2 size={20} color={diff.color} /> : <Circle size={20} color={C.muted} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollBox>
        )}
      </GlassCard>
    </div>
  );
}

function formatChallengeDateTime(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const monthNames = TR[lang === "en" ? "en" : "de"].monthNames;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (lang === "en") return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${hh}:${mm}`;
  return `${String(d.getDate()).padStart(2, "0")}. ${monthNames[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm} Uhr`;
}

/* ============================================================================
   ROUTINES TAB — recurring training plans with a futuristic card layout
============================================================================ */

const ROUTINE_CATEGORY_COLORS = { strength: C.red, endurance: C.amber, mobility: C.green };

function emptyRoutineForm() {
  return { id: null, name: "", description: "", duration: "", goalText: "", category: "strength" };
}

function RoutineCard({ theme, routine, t, lang, onLog, onDelete }) {
  const today = todayStr();
  const todayStatus = routine.log && routine.log[today];
  const catColor = ROUTINE_CATEGORY_COLORS[routine.category] || theme.primary;
  const catLabel = t(`cat${routine.category === "strength" ? "Strength" : routine.category === "endurance" ? "Endurance" : "Mobility"}`);

  const doneDates = Object.keys(routine.log || {}).filter((k) => routine.log[k] === "done").sort();
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const ds = ymdFromDate(cursor);
    if (routine.log && routine.log[ds] === "done") { streak++; cursor.setDate(cursor.getDate() - 1); } else break;
  }

  return (
    <div className="routine-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{routine.name}</div>
          <span className="routine-cat-pill" style={{ color: catColor, border: `1px solid ${hexAlpha(catColor, "70")}`, background: hexAlpha(catColor, "16"), marginTop: 6 }}>{catLabel}</span>
        </div>
        <button onClick={() => onDelete(routine.id)} className="lift-btn" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", opacity: 0.6, flexShrink: 0 }}>
          <Trash2 size={13} />
        </button>
      </div>
      {routine.description && <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>{routine.description}</div>}
      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
        {routine.duration && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
            <Clock size={12} color={theme.accent} /> {routine.duration} {t("minutesShort")}
          </div>
        )}
        {routine.goalText && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
            <Target size={12} color={theme.accent} /> {routine.goalText}
          </div>
        )}
        {streak > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: C.amber }}>
            🔥 {streak} {t("routineStreak")}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onLog(routine.id, "done")}
          className="routine-action-btn"
          style={{
            background: todayStatus === "done" ? `linear-gradient(135deg, ${C.green}, ${theme.accent})` : hexAlpha(C.green, "16"),
            color: todayStatus === "done" ? "#0a0118" : C.green,
            borderColor: hexAlpha(C.green, "60"),
          }}
        >
          ✅ {t("markRoutineDone")}
        </button>
        <button
          onClick={() => onLog(routine.id, "skipped")}
          className="routine-action-btn"
          style={{
            background: todayStatus === "skipped" ? hexAlpha(C.red, "40") : hexAlpha(C.red, "12"),
            color: C.red,
            borderColor: hexAlpha(C.red, "50"),
          }}
        >
          ⏭️ {t("markRoutineSkipped")}
        </button>
      </div>
      {todayStatus && (
        <div className="routine-feedback" style={{ marginTop: 8, color: todayStatus === "done" ? C.green : C.muted }}>
          {routine.feedback}
        </div>
      )}
    </div>
  );
}

function RoutinesCard({ theme, routines, onAdd, onLog, onDelete, t, lang }) {
  const [form, setForm] = useState(emptyRoutineForm());
  const [errMsg, setErrMsg] = useState("");

  function submit() {
    if (!form.name.trim()) { setErrMsg(t("fillRoutineName")); return; }
    onAdd({ ...form, id: "r" + Date.now(), log: {} });
    setForm(emptyRoutineForm());
    setErrMsg("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <GlassCard title={t("newRoutine")} icon={<Dumbbell size={14} color={theme.accent} />} from="top" delay={0}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("routineName")}</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t("routineNamePlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("routineDescription")}</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={t("routineDescriptionPlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("routineDuration")}</label>
            <input type="number" min="0" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="45"
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("routineCategory")}</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }}>
              <option value="strength">{t("catStrength")}</option>
              <option value="endurance">{t("catEndurance")}</option>
              <option value="mobility">{t("catMobility")}</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("routineGoal")}</label>
            <input value={form.goalText} onChange={(e) => setForm((f) => ({ ...f, goalText: e.target.value }))} placeholder={t("routineGoalPlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>
        {errMsg && <div style={{ fontSize: 11.5, color: C.red, marginBottom: 8 }}>{errMsg}</div>}
        <button onClick={submit} className="lift-btn" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, border: "none", borderRadius: 10,
          padding: "9px 18px", cursor: "pointer", boxShadow: `0 4px 14px ${hexAlpha(theme.primary, "50")}`,
        }}>
          <Save size={13} /> {t("saveRoutine")}
        </button>
      </GlassCard>

      <GlassCard title={t("routinesTitle")} icon={<ListChecks size={14} color={theme.accent} />} from="bottom" delay={100}>
        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>{t("routinesSub")}</div>
        {routines.length === 0 ? (
          <div style={{ fontSize: 12, color: C.muted }}>{t("noRoutines")}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {routines.map((r) => (
              <RoutineCard key={r.id} theme={theme} routine={r} t={t} lang={lang} onLog={onLog} onDelete={onDelete} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ============================================================================
   GOALS TAB — long-term goals with progress bars + confetti on completion
============================================================================ */

const GOAL_CATEGORY_COLORS = { health: C.green, fitness: C.amber, career: C.pink, learning: "#8b5cf6" };

function emptyGoalForm() {
  return { id: null, name: "", date: "", period: "", category: "health" };
}

function GoalCardItem({ theme, goal, t, onUpdateProgress, onDelete }) {
  const catColor = GOAL_CATEGORY_COLORS[goal.category] || theme.primary;
  const catKey = goal.category === "health" ? "catHealth" : goal.category === "fitness" ? "catFitness" : goal.category === "career" ? "catCareer" : "catLearning";
  const achieved = goal.progress >= 100;
  return (
    <div className="goal-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>{goal.name}</div>
          <span className="routine-cat-pill" style={{ color: catColor, border: `1px solid ${hexAlpha(catColor, "70")}`, background: hexAlpha(catColor, "16"), marginTop: 6 }}>{t(catKey)}</span>
        </div>
        <button onClick={() => onDelete(goal.id)} title={t("deleteGoal")} className="lift-btn" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", opacity: 0.6, flexShrink: 0 }}>
          <Trash2 size={13} />
        </button>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap", fontSize: 11, color: C.muted }}>
        {goal.date && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><CalendarDays size={12} color={theme.accent} />{goal.date}</span>}
        {goal.period && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} color={theme.accent} />{goal.period}</span>}
        {achieved && <span className="goal-achieved-badge"><Trophy size={11} /> {t("goalAchieved")}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.muted }}>{t("progress")}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: achieved ? C.amber : theme.accent }}>{goal.progress}%</span>
      </div>
      <div className="goal-progress-track" style={{ marginBottom: 10 }}>
        <div className="goal-progress-fill" style={{ width: `${goal.progress}%`, background: achieved ? `linear-gradient(90deg, ${C.amber}, ${theme.accent})` : `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }} />
      </div>
      <input
        type="range" min="0" max="100" step="5" value={goal.progress}
        onChange={(e) => onUpdateProgress(goal.id, Number(e.target.value))}
        className="goal-slider"
      />
    </div>
  );
}

function GoalsCard({ theme, goals, onAdd, onUpdateProgress, onDelete, t }) {
  const [form, setForm] = useState(emptyGoalForm());
  const [errMsg, setErrMsg] = useState("");

  function submit() {
    if (!form.name.trim() || !form.date) { setErrMsg(t("fillGoalName")); return; }
    onAdd({ ...form, id: "g" + Date.now(), progress: 0 });
    setForm(emptyGoalForm());
    setErrMsg("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <GlassCard title={t("newGoal")} icon={<Target size={14} color={theme.accent} />} from="top" delay={0}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("goalName")}</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t("goalNamePlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("goalDate")}</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("goalPeriod")}</label>
            <input value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} placeholder={t("goalPeriodPlaceholder")}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, color: C.muted, display: "block", marginBottom: 4 }}>{t("goalCategory")}</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 12, border: `1px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.05)" }}>
              <option value="health">{t("catHealth")}</option>
              <option value="fitness">{t("catFitness")}</option>
              <option value="career">{t("catCareer")}</option>
              <option value="learning">{t("catLearning")}</option>
            </select>
          </div>
        </div>
        {errMsg && <div style={{ fontSize: 11.5, color: C.red, marginBottom: 8 }}>{errMsg}</div>}
        <button onClick={submit} className="lift-btn" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, border: "none", borderRadius: 10,
          padding: "9px 18px", cursor: "pointer", boxShadow: `0 4px 14px ${hexAlpha(theme.primary, "50")}`,
        }}>
          <Save size={13} /> {t("saveGoal")}
        </button>
      </GlassCard>

      <GlassCard title={t("goalsTitle")} icon={<Trophy size={14} color={theme.accent} />} from="bottom" delay={100}>
        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>{t("goalsSub")}</div>
        {goals.length === 0 ? (
          <div style={{ fontSize: 12, color: C.muted }}>{t("noGoals")}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {goals.map((g) => (
              <GoalCardItem key={g.id} theme={theme} goal={g} t={t} onUpdateProgress={onUpdateProgress} onDelete={onDelete} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ============================================================================
   MAIN APP
============================================================================ */

export default function App() {
  const now = new Date();
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [logs, setLogs] = useState({});
  const [mood, setMood] = useState({});
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalText, setJournalText] = useState("");
  const [journalError, setJournalError] = useState("");
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [water, setWater] = useState({});
  const [events, setEvents] = useState([]);
  const [meals, setMeals] = useState([]);
  const [lang, setLangState] = useState("de");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [storageStatus, setStorageStatus] = useState(null);
  const [notice, setNotice] = useState(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("✅");
  const [addingHabit, setAddingHabit] = useState(false);
  const [activeTab, setActiveTab] = useState("entry");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [pulseCell, setPulseCell] = useState(null);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [challengeDifficulty, setChallengeDifficulty] = useState("leicht");
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState("");
  const [routines, setRoutines] = useState([]);
  const [goals, setGoals] = useState([]);
  const themeSaveTimers = useRef({});
  const prevBadgesRef = useRef(null);
  const prevChallengeBadgesRef = useRef(null);
  const prevGoalsAchievedRef = useRef(null);
  const rollTimerRef = useRef(null);

  const T = TR[lang] || TR.de;
  const t = (key) => T[key];

  function dayLabel(dateStr) { return `${t("day")} ${dayOfMonthFromStr(dateStr)}`; }
  function fullDayLabel(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return `${t("day")} ${d.getDate()} · ${T.monthNames[d.getMonth()]} ${d.getFullYear()}`;
  }
  /* Full date + time label for journal-style entries, e.g. "04. September 2026, 14:30 Uhr" (de)
     or "September 4, 2026, 2:30 PM" (en). Accepts an ISO timestamp; falls back to a plain date. */
  function fullDateTimeLabel(isoOrDate) {
    if (!isoOrDate) return "";
    const d = isoOrDate.length > 10 ? new Date(isoOrDate) : new Date(isoOrDate + "T00:00:00");
    if (isNaN(d.getTime())) return isoOrDate;
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    if (lang === "en") {
      return `${T.monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${hh}:${mm}`;
    }
    return `${String(d.getDate()).padStart(2, "0")}. ${T.monthNames[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm} Uhr`;
  }

  const NAV_ITEMS = [
    { id: "entry", label: t("navEntry"), icon: PenLine },
    { id: "stats", label: t("navStats"), icon: BarChart3 },
    { id: "activity", label: t("navActivity"), icon: Activity },
    { id: "events", label: t("navEvents"), icon: CalendarDays },
    { id: "challenges", label: t("navChallenges"), icon: Dices },
    { id: "routines", label: t("navRoutines"), icon: Dumbbell },
    { id: "goals", label: t("navGoals"), icon: Target },
  ];

  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({ id: i, left: Math.random() * 100, size: 3 + Math.random() * 5, duration: 12 + Math.random() * 16, delay: Math.random() * 12, colorIdx: i % 2 }))
  ).current;

  useEffect(() => {
    (async () => {
      const test = await storageSelfTest();
      setStorageStatus(test);
      const [u, h, l, m, th, je, w, ev, lg, fd, cd, ch, ro, go] = await Promise.all([
        loadKey("dashboardUser", null),
        loadKey("gridHabits", DEFAULT_HABITS),
        loadKey("gridLogs", {}),
        loadKey("gridMood", {}),
        loadKey("gridTheme", DEFAULT_THEME),
        loadKey("dashboardJournal", []),
        loadKey("dashboardWater", {}),
        loadKey("dashboardEvents", []),
        loadKey("dashboardLang", "de"),
        loadKey("dashboardMeals", []),
        loadKey("challengeDifficulty", "leicht"),
        loadKey("challengeHistory", []),
        loadKey("dashboardRoutines", []),
        loadKey("dashboardGoals", []),
      ]);
      setUser(u);
      setHabits(h);
      setLogs(l);
      setMood(m);
      setTheme({ ...DEFAULT_THEME, ...th });
      setJournalEntries(Array.isArray(je) ? je : []);
      setWater(w);
      setEvents(ev);
      setMeals(Array.isArray(fd) ? fd : []);
      setLangState(lg === "en" ? "en" : "de");
      setChallengeDifficulty(CHALLENGE_DIFFICULTIES.includes(cd) ? cd : "leicht");
      setChallengeHistory(Array.isArray(ch) ? ch : []);
      setRoutines(Array.isArray(ro) ? ro : []);
      setGoals(Array.isArray(go) ? go : []);
      setBooting(false);
    })();
  }, []);

  /* Quote of the day: auto-advance to a new random quote every 10 minutes */
  useEffect(() => {
    const list = lang === "en" ? QUOTES_EN : QUOTES;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => randomIndexExcluding(list.length, prev));
    }, QUOTE_ROTATE_MS);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    return () => { if (rollTimerRef.current) clearInterval(rollTimerRef.current); };
  }, []);

  function nextQuote() {
    const list = lang === "en" ? QUOTES_EN : QUOTES;
    setQuoteIndex((prev) => randomIndexExcluding(list.length, prev));
  }

  function flash(msg, isError) {
    setNotice({ msg, isError: !!isError });
    setTimeout(() => setNotice(null), isError ? 4000 : 1500);
  }
  function triggerPulse(id) {
    setPulseCell(id);
    setTimeout(() => setPulseCell((prev) => (prev === id ? null : prev)), 480);
  }
  function fireConfetti() {
    setConfettiPieces(makeConfettiPieces(theme));
    setTimeout(() => setConfettiPieces([]), 3200);
  }

  async function setLang(next) {
    setLangState(next);
    await save("dashboardLang", next);
  }

  async function handleLogin(name) {
    setUser(name);
    const ok = await save("dashboardUser", name);
    if (!ok) flash("Name nicht dauerhaft gespeichert", true);
  }
  async function handleLogout() {
    try { localStorage.removeItem("dashboardUser"); } catch (e) {}
    setUser(null);
  }

  function trySwitchTab(id) {
    if (id === activeTab) return;
    if (journalTitle.trim() || journalText.trim()) {
      const ok = window.confirm("Du hast einen ungespeicherten Tagebucheintrag. Beim Verlassen des Tabs geht er verloren. Trotzdem fortfahren?");
      if (!ok) return;
      setJournalTitle("");
      setJournalText("");
      setJournalError("");
    }
    setActiveTab(id);
  }

  async function saveJournalEntry() {
    const titleTrim = journalTitle.trim();
    const textTrim = journalText.trim();
    if (!titleTrim) { setJournalError(t("titleRequired")); return; }
    if (!textTrim) { setJournalError(t("textRequired")); return; }
    const nowTs = new Date();
    const entry = { id: "j" + Date.now(), title: titleTrim, text: textTrim, date: todayStr(), timestamp: nowTs.toISOString() };
    const next = [entry, ...journalEntries];
    setJournalEntries(next);
    setJournalTitle("");
    setJournalText("");
    setJournalError("");
    const ok = await save("dashboardJournal", next);
    flash(ok ? t("saved") : t("entryNotSaved"), !ok);
  }

  const nDays = daysInMonth(year, month);
  const dayNumbers = useMemo(() => Array.from({ length: nDays }, (_, i) => i + 1), [nDays]);
  const weekGroups = useMemo(() => chunk7(dayNumbers), [dayNumbers]);

  async function toggleCell(habitId, day) {
    const dateStr = ymd(year, month, day);
    const next = { ...logs, [dateStr]: { ...(logs[dateStr] || {}), [habitId]: !(logs[dateStr] && logs[dateStr][habitId]) } };
    setLogs(next);
    triggerPulse(`${habitId}_${day}`);
    const ok = await save("gridLogs", next);
    if (!ok) flash("Konnte Häkchen nicht dauerhaft speichern", true);
  }
  async function setMoodValue(day, field, value) {
    const dateStr = ymd(year, month, day);
    const num = value === "" ? undefined : Math.max(1, Math.min(10, Number(value)));
    const next = { ...mood, [dateStr]: { ...(mood[dateStr] || {}), [field]: num } };
    setMood(next);
    triggerPulse(`mood_${day}_${field}`);
    const ok = await save("gridMood", next);
    if (!ok) flash("Konnte Wert nicht dauerhaft speichern", true);
  }
  async function addHabit() {
    if (!newHabitName.trim()) return;
    const h = { id: "h" + Date.now(), name: newHabitName.trim(), emoji: newHabitEmoji || "✅" };
    const next = [...habits, h];
    setHabits(next);
    setNewHabitName(""); setNewHabitEmoji("✅"); setAddingHabit(false);
    const ok = await save("gridHabits", next);
    flash(ok ? "Gewohnheit hinzugefügt" : "Hinzufügen nicht dauerhaft gespeichert", !ok);
  }
  async function removeHabit(id) {
    const next = habits.filter((h) => h.id !== id);
    setHabits(next);
    const ok = await save("gridHabits", next);
    flash(ok ? "Entfernt" : "Entfernen nicht dauerhaft gespeichert", !ok);
  }
  function updateTheme(key, value) {
    setTheme((prev) => {
      const next = { ...prev, [key]: value };
      clearTimeout(themeSaveTimers.current[key]);
      themeSaveTimers.current[key] = setTimeout(async () => {
        const ok = await save("gridTheme", next);
        if (!ok) flash("Nicht dauerhaft gespeichert", true);
      }, 350);
      return next;
    });
  }
  async function resetTheme() {
    setTheme(DEFAULT_THEME);
    const ok = await save("gridTheme", DEFAULT_THEME);
    flash(ok ? "Farben zurückgesetzt" : "Zurücksetzen nicht dauerhaft gespeichert", !ok);
  }
  async function setWaterValue(dateKey, count) {
    const next = { ...water, [dateKey]: Math.max(0, Math.min(8, count)) };
    setWater(next);
    const ok = await save("dashboardWater", next);
    if (!ok) flash("Wasser nicht dauerhaft gespeichert", true);
  }

  /* ---- food tracker ---- */
  async function logMeal(type) {
    const meal = { id: "m" + Date.now(), type, timestamp: Date.now() };
    const next = [meal, ...meals].slice(0, 500);
    setMeals(next);
    const ok = await save("dashboardMeals", next);
    if (!ok) flash("Mahlzeit nicht dauerhaft gespeichert", true);
    if (type === "unhealthy") {
      const weekAgo = Date.now() - 7 * 86400000;
      const unhealthyThisWeek = next.filter((m) => m.type === "unhealthy" && m.timestamp >= weekAgo).length;
      if (unhealthyThisWeek === 4) flash(t("foodWarning"), true);
    }
  }

  /* ---- events ---- */
  async function saveEvent(ev) {
    const exists = events.some((e) => e.id === ev.id);
    const next = exists ? events.map((e) => (e.id === ev.id ? { ...e, ...ev } : e)) : [...events, { done: false, ...ev }];
    setEvents(next);
    const ok = await save("dashboardEvents", next);
    flash(ok ? t("eventSaved") : t("eventNotSaved"), !ok);
  }
  async function deleteEvent(id) {
    const next = events.filter((e) => e.id !== id);
    setEvents(next);
    const ok = await save("dashboardEvents", next);
    flash(ok ? t("eventDeleted") : t("eventNotSaved"), !ok);
  }
  async function toggleEventDone(id) {
    const next = events.map((e) => (e.id === id ? { ...e, done: !e.done } : e));
    setEvents(next);
    const ok = await save("dashboardEvents", next);
    if (!ok) flash(t("eventNotSaved"), true);
  }

  /* ---- challenge dice ---- */
  async function selectChallengeDifficulty(id) {
    if (isRolling) return;
    setChallengeDifficulty(id);
    await save("challengeDifficulty", id);
  }
  function rollChallengeDice() {
    if (isRolling) return;
    setIsRolling(true);
    let ticks = 0;
    rollTimerRef.current = setInterval(() => {
      const ex = randomChallengeExercise(lang);
      setRollingText(ex.format(ex.values[challengeDifficulty]));
      ticks++;
      if (ticks >= 9) {
        clearInterval(rollTimerRef.current);
        const entry = makeChallengeEntry(challengeDifficulty, lang);
        setChallengeHistory((prev) => {
          const next = [entry, ...prev];
          save("challengeHistory", next);
          return next;
        });
        setRollingText("");
        setIsRolling(false);
      }
    }, 90);
  }
  function toggleChallengeDone(id) {
    setChallengeHistory((prev) => {
      const next = prev.map((e) =>
        e.id === id ? { ...e, done: !e.done, doneAt: e.done ? null : new Date().toISOString() } : e
      );
      save("challengeHistory", next);
      return next;
    });
  }

  /* ---- routines ---- */
  async function addRoutine(routine) {
    const next = [...routines, routine];
    setRoutines(next);
    const ok = await save("dashboardRoutines", next);
    if (!ok) flash("Routine nicht dauerhaft gespeichert", true);
  }
  async function deleteRoutine(id) {
    const next = routines.filter((r) => r.id !== id);
    setRoutines(next);
    await save("dashboardRoutines", next);
  }
  async function logRoutine(id, status) {
    const today = todayStr();
    const doneFeedback = T.routineDoneFeedback;
    const skippedFeedback = T.routineSkippedFeedback;
    const next = routines.map((r) => {
      if (r.id !== id) return r;
      const pool = status === "done" ? doneFeedback : skippedFeedback;
      const feedback = pool[Math.floor(Math.random() * pool.length)];
      return { ...r, log: { ...(r.log || {}), [today]: status }, feedback };
    });
    setRoutines(next);
    const ok = await save("dashboardRoutines", next);
    if (!ok) flash("Routine-Status nicht dauerhaft gespeichert", true);
  }

  /* ---- goals ---- */
  async function addGoal(goal) {
    const next = [...goals, goal];
    setGoals(next);
    const ok = await save("dashboardGoals", next);
    if (!ok) flash("Ziel nicht dauerhaft gespeichert", true);
  }
  async function deleteGoal(id) {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    await save("dashboardGoals", next);
  }
  async function updateGoalProgress(id, progress) {
    const next = goals.map((g) => (g.id === id ? { ...g, progress } : g));
    setGoals(next);
    const ok = await save("dashboardGoals", next);
    if (!ok) flash("Fortschritt nicht dauerhaft gespeichert", true);
  }

  /* ---- notifications: count of open (not done, not past) events ---- */
  const openEventsCount = useMemo(
    () => events.filter((e) => !e.done && !isEventPast(e)).length,
    [events]
  );

  /* ---- derived stats ---- */
  const stats = useMemo(() => {
    const checked = (h, d) => !!(logs[ymd(year, month, d)] && logs[ymd(year, month, d)][h.id]);
    const daily = dayNumbers.map((d) => {
      const total = habits.length, done = habits.filter((h) => checked(h, d)).length;
      return { label: `${t("day")} ${d}`, value: total ? Math.round((done / total) * 100) : 0 };
    });
    const weekly = weekGroups.map((grp, i) => {
      let total = 0, done = 0;
      grp.forEach((d) => { habits.forEach((h) => { total++; if (checked(h, d)) done++; }); });
      return { label: `${t("week")} ${i + 1}`, value: total ? Math.round((done / total) * 100) : 0 };
    });
    const monthly = T.monthShort.map((label, mi) => {
      const dim = daysInMonth(year, mi);
      let total = 0, done = 0;
      for (let d = 1; d <= dim; d++) {
        habits.forEach((h) => {
          total++;
          const ds = ymd(year, mi, d);
          if (logs[ds] && logs[ds][h.id]) done++;
        });
      }
      return { label, value: total ? Math.round((done / total) * 100) : 0 };
    });
    const goal = habits.length * nDays;
    const completed = habits.reduce((sum, h) => sum + dayNumbers.filter((d) => checked(h, d)).length, 0);
    const left = goal - completed;
    const analysis = habits.map((h) => {
      const goalH = nDays, actual = dayNumbers.filter((d) => checked(h, d)).length;
      const leftH = goalH - actual, pct = goalH ? Math.round((actual / goalH) * 100) : 0;
      return { habit: h, goal: goalH, actual, left: leftH, pct };
    });
    const top10 = [...analysis].sort((a, b) => b.pct - a.pct).slice(0, 10);
    const moodSeries = dayNumbers.map((d) => {
      const rec = mood[ymd(year, month, d)] || {};
      return { label: `${t("day")} ${d}`, mood: rec.mood ?? null, motivation: rec.motivation ?? null };
    });
    return { daily, weekly, monthly, goal, completed, left, analysis, top10, moodSeries };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, logs, mood, dayNumbers, weekGroups, year, month, nDays, lang]);

  const overallPct = stats.goal ? Math.round((stats.completed / stats.goal) * 100) : 0;

  const badgeStats = useMemo(() => {
    const { current, longest } = computeStreaks(habits, logs);
    let totalChecks = 0;
    Object.values(logs).forEach((day) => { Object.values(day).forEach((v) => { if (v) totalChecks++; }); });
    const maxWater = Object.values(water).reduce((m, v) => Math.max(m, v), 0);
    const noteCount = journalEntries.length;
    return { currentStreak: current, longestStreak: longest, totalChecks, maxWater, noteCount };
  }, [habits, logs, water, journalEntries]);

  const unlockedBadges = useMemo(() => {
    const s = new Set();
    BADGE_DEFS.forEach((b) => { if (b.check(badgeStats)) s.add(b.id); });
    return s;
  }, [badgeStats]);

  /* Expanded challenge stats used by the 18-badge set above */
  const challengeStats = useMemo(() => {
    const totalRolls = challengeHistory.length;
    const doneEntries = challengeHistory.filter((e) => e.done);
    const totalDone = doneEntries.length;
    const hardDone = doneEntries.filter((e) => e.difficulty === "hard").length;

    const perDay = {};
    doneEntries.forEach((e) => {
      const k = challengeDayKey(e.doneAt);
      if (!k) return;
      perDay[k] = (perDay[k] || 0) + 1;
    });
    const maxDoneInOneDay = Object.values(perDay).reduce((m, v) => Math.max(m, v), 0);

    const exercisesDone = new Set(doneEntries.map((e) => e.exerciseId));
    const exerciseDiffs = {};
    doneEntries.forEach((e) => {
      if (!exerciseDiffs[e.exerciseId]) exerciseDiffs[e.exerciseId] = new Set();
      exerciseDiffs[e.exerciseId].add(e.difficulty);
    });
    const hardExercises = new Set(doneEntries.filter((e) => e.difficulty === "hard").map((e) => e.exerciseId));

    // trailing-7-day distinct-done-day count (for "weekly hero")
    const last7 = new Set();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.add(ymdFromDate(d));
    }
    const doneDaysLast7 = [...last7].filter((k) => perDay[k] > 0).length;

    // distinct done-days so far this calendar month (for "monthly champion")
    const nowD = new Date();
    const monthPrefix = `${nowD.getFullYear()}-${String(nowD.getMonth() + 1).padStart(2, "0")}`;
    const doneDaysThisMonth = Object.keys(perDay).filter((k) => k.startsWith(monthPrefix) && perDay[k] > 0).length;
    const daysElapsedThisMonth = nowD.getDate();

    return {
      totalRolls, totalDone, hardDone, maxDoneInOneDay, exercisesDone, exerciseDiffs, hardExercises,
      doneDaysLast7, doneDaysThisMonth, daysElapsedThisMonth,
    };
  }, [challengeHistory]);

  const unlockedChallengeBadges = useMemo(() => {
    const s = new Set();
    CHALLENGE_BADGE_DEFS.forEach((b) => { if (b.check(challengeStats)) s.add(b.id); });
    return s;
  }, [challengeStats]);

  useEffect(() => {
    if (prevBadgesRef.current === null) { prevBadgesRef.current = unlockedBadges; return; }
    const newly = [...unlockedBadges].filter((id) => !prevBadgesRef.current.has(id));
    if (newly.length > 0) fireConfetti();
    prevBadgesRef.current = unlockedBadges;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedBadges]);

  useEffect(() => {
    if (prevChallengeBadgesRef.current === null) { prevChallengeBadgesRef.current = unlockedChallengeBadges; return; }
    const newly = [...unlockedChallengeBadges].filter((id) => !prevChallengeBadgesRef.current.has(id));
    if (newly.length > 0) fireConfetti();
    prevChallengeBadgesRef.current = unlockedChallengeBadges;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedChallengeBadges]);

  /* Confetti fires the moment a goal's progress reaches 100% */
  useEffect(() => {
    const achievedIds = new Set(goals.filter((g) => g.progress >= 100).map((g) => g.id));
    if (prevGoalsAchievedRef.current === null) { prevGoalsAchievedRef.current = achievedIds; return; }
    const newly = [...achievedIds].filter((id) => !prevGoalsAchievedRef.current.has(id));
    if (newly.length > 0) fireConfetti();
    prevGoalsAchievedRef.current = achievedIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

  if (booting) {
    return (
      <div className="habit-app" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: DEFAULT_THEME.background, position: "relative" }}>
        <GlobalStyles theme={DEFAULT_THEME} />
        <Loader2 className="animate-spin" color={DEFAULT_THEME.primary} size={30} />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen theme={theme} particles={particles} onLogin={handleLogin} t={t} />;
  }

  const cellSize = 32;

  return (
    <div className="habit-app" style={{ minHeight: "100vh", position: "relative", color: C.text, padding: 16, overflow: "hidden" }}>
      <GlobalStyles theme={theme} />
      <AnimatedBackground theme={theme} particles={particles} />
      <Confetti pieces={confettiPieces} />

      <button className="icon-btn" onClick={() => setSettingsOpen((v) => !v)} title={t("settings")} style={{ position: "fixed", top: 16, right: 16, zIndex: 96, width: 38, height: 38 }}>
        <Settings size={17} />
      </button>
      <button className="icon-btn bell-btn" onClick={() => setNotificationsOpen((v) => !v)} title={t("notifications")} style={{ position: "fixed", top: 62, right: 16, zIndex: 96, width: 38, height: 38 }}>
        <Bell size={16} />
        {openEventsCount > 0 && <span className="badge-dot">{openEventsCount}</span>}
      </button>
      <button className="icon-btn info-btn" onClick={() => setAboutModalOpen(true)} title={t("aboutTooltip")} style={{ position: "fixed", top: 108, right: 16, zIndex: 96, width: 38, height: 38 }}>
        <Info size={16} />
      </button>

      {settingsOpen && (
        <SettingsPanel theme={theme} onChange={updateTheme} onReset={resetTheme} onClose={() => setSettingsOpen(false)} t={t} lang={lang} setLang={setLang} />
      )}
      {notificationsOpen && (
        <NotificationsPanel theme={theme} events={events} onToggleDone={toggleEventDone} onClose={() => setNotificationsOpen(false)} t={t} />
      )}
      {aboutModalOpen && (
        <AboutModal theme={theme} t={t} lang={lang} onClose={() => setAboutModalOpen(false)} />
      )}

      {notice && (
        <div style={{ position: "fixed", top: 154, right: 16, zIndex: 100, background: notice.isError ? "rgba(251,113,133,0.9)" : hexAlpha(theme.primary, "e6"), backdropFilter: "blur(10px)", color: "#fff", padding: "9px 16px", borderRadius: 12, fontSize: 12, maxWidth: 260, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
          {notice.msg}
        </div>
      )}

      {storageStatus && !storageStatus.ok && (
        <div style={{ position: "relative", zIndex: 1, background: "rgba(251,113,133,0.12)", border: `1px solid ${C.red}`, borderRadius: 14, padding: "8px 12px", fontSize: 12, color: C.red, marginBottom: 12, textAlign: "center" }}>
          {t("storageWarning")(storageStatus.detail)}
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ---------- header ---------- */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ textAlign: "center" }}>
            <h1 className="display" style={{ fontSize: 26, fontWeight: 700, margin: 0, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 8px ${theme.accent}`, flexShrink: 0 }} />
              {t("dashboardOf")(user)}
            </h1>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span>{T.monthNames[month]} {year}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <button onClick={handleLogout} className="lift-btn" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12 }}>
                <LogOut size={12} /> {t("logout")}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}`, borderRadius: 999, padding: 5, backdropFilter: "blur(14px)", flexWrap: "wrap", justifyContent: "center" }}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`nav-pill ${activeTab === id ? "active" : ""}`} onClick={() => trySwitchTab(id)}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- ENTRY TAB ---------- */}
        {activeTab === "entry" && (
          <div key="entry" className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <GlassCard from="top" delay={0} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{t("calendar")}</span>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
                {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={selectStyle}>
                {T.monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              {badgeStats.currentStreak > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent, display: "flex", alignItems: "center", gap: 4 }}>
                  🔥 {badgeStats.currentStreak}-{t("streak")}
                </span>
              )}
            </GlassCard>

            <GlassCard from="left" delay={120} style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${nDays}, ${cellSize}px)`, gridAutoRows: cellSize + 4, fontSize: 10, minWidth: 200 + nDays * cellSize }}>
                <div style={{ display: "flex", alignItems: "center", fontWeight: 700, fontSize: 11, padding: "0 6px", borderBottom: `1px solid ${C.glassBorder}` }}>{t("myHabits")}</div>
                {weekGroups.map((grp, i) => (
                  <div key={i} style={{ gridColumn: `span ${grp.length}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: theme.accent, borderBottom: `1px solid ${C.glassBorder}` }}>{t("week")} {i + 1}</div>
                ))}
                <div style={{ borderBottom: `1px solid ${C.glassBorder}` }} />
                {dayNumbers.map((d, i) => (
                  <div key={"wd" + d} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, borderBottom: `1px solid ${C.glassBorder}` }}>{T.weekdayLetters[i % 7]}</div>
                ))}
                <div style={{ borderBottom: `1px solid ${C.glassBorder}` }} />
                {dayNumbers.map((d) => (
                  <div key={"dn" + d} title={`${t("day")} ${d}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${C.glassBorder}`, fontWeight: 600, color: C.text }}>{d}</div>
                ))}
                {habits.map((h) => (
                  <React.Fragment key={h.id}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid rgba(255,255,255,0.06)`, fontSize: 11.5, gap: 4, padding: "0 6px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.emoji} {h.name}</span>
                      <button onClick={() => removeHabit(h.id)} className="lift-btn" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", flexShrink: 0, opacity: 0.6 }} title={t("remove")}><X size={12} /></button>
                    </div>
                    {dayNumbers.map((d) => {
                      const on = !!(logs[ymd(year, month, d)] && logs[ymd(year, month, d)][h.id]);
                      const cellKey = `${h.id}_${d}`;
                      return (
                        <div key={cellKey} title={`${t("day")} ${d}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                          <button onClick={() => toggleCell(h.id, d)} className={`circle-btn ${on ? "checked" : ""} ${pulseCell === cellKey ? "pulse" : ""}`} style={{ width: 24, height: 24 }}>
                            {on && <Check size={13} color="#fff" />}
                          </button>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
                <div style={{ display: "flex", alignItems: "center", padding: "0 6px" }}>
                  {addingHabit ? (
                    <div style={{ display: "flex", gap: 4, width: "100%" }}>
                      <input value={newHabitEmoji} onChange={(e) => setNewHabitEmoji(e.target.value)} style={{ ...selectStyle, width: 34, textAlign: "center", padding: "2px" }} maxLength={2} />
                      <input value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit()} placeholder={t("name")} style={{ ...selectStyle, flex: 1, padding: "2px 8px" }} autoFocus />
                      <button onClick={addHabit} className="circle-btn checked lift-btn" style={{ width: 24, height: 24, flexShrink: 0 }}><Check size={12} color="#fff" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingHabit(true)} className="lift-btn" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>
                      <Plus size={12} /> {t("addHabit")}
                    </button>
                  )}
                </div>
                {dayNumbers.map((d) => <div key={"pad" + d} />)}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ---------- STATS TAB ---------- */}
        {activeTab === "stats" && (
          <div key="stats" className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <GlassCard title={t("dailyProgress")} from="left" delay={0}>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={stats.daily} margin={{ bottom: 24 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.muted }} interval={0} angle={-60} textAnchor="end" height={40} />
                    <YAxis domain={[0, 100]} width={28} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => v + "%"} />
                    <Tooltip formatter={(v) => v + "%"} contentStyle={{ fontSize: 11, background: "#1a1030", border: `1px solid ${C.glassBorder}`, borderRadius: 10 }} />
                    <Bar dataKey="value" fill={theme.primary} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
              <GlassCard title={t("weeklyProgress")} from="right" delay={80}>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={stats.weekly}>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} />
                    <YAxis domain={[0, 100]} width={28} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => v + "%"} />
                    <Tooltip formatter={(v) => v + "%"} contentStyle={{ fontSize: 11, background: "#1a1030", border: `1px solid ${C.glassBorder}`, borderRadius: 10 }} />
                    <Bar dataKey="value" fill={theme.accent} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out" animationBegin={150} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            <GlassCard title={`${t("monthlyProgress")} ${year}`} from="top" delay={130}>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={stats.monthly}>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} />
                  <YAxis domain={[0, 100]} width={28} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => v + "%"} />
                  <Tooltip formatter={(v) => v + "%"} contentStyle={{ fontSize: 11, background: "#1a1030", border: `1px solid ${C.glassBorder}`, borderRadius: 10 }} />
                  <Bar dataKey="value" fill={C.pink} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out" animationBegin={300} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14 }}>
              <GlassCard from="left" delay={180}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 14 }}>
                  <div><div style={{ color: C.muted }}>{t("goal")}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{stats.goal}</div></div>
                  <div><div style={{ color: C.muted }}>{t("done")}</div><div style={{ fontWeight: 700, fontSize: 18, color: C.green }}>{stats.completed}</div></div>
                  <div><div style={{ color: C.muted }}>{t("open")}</div><div style={{ fontWeight: 700, fontSize: 18, color: C.amber }}>{stats.left}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie data={[{ v: stats.completed }, { v: stats.left }]} dataKey="v" innerRadius={32} outerRadius={48} startAngle={90} endAngle={-270} stroke="none" isAnimationActive animationDuration={1000} animationEasing="ease-out">
                        <Cell fill={theme.primary} /><Cell fill="rgba(255,255,255,0.08)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, marginTop: -8 }}>{overallPct}%</div>
              </GlassCard>

              <GlassCard title={t("analysisPerHabit")} from="right" delay={230}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 32px 30px", fontSize: 10, color: C.muted, marginBottom: 6, fontWeight: 700 }}>
                  <span>{t("habit")}</span><span>{t("actual")}</span><span>{t("open")}</span><span>{t("percent")}</span>
                </div>
                <ScrollBox maxHeight={280}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {stats.analysis.map((r) => (
                      <div key={r.habit.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 32px 30px", fontSize: 11 }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.habit.emoji} {r.habit.name}</span>
                          <span>{r.actual}</span><span>{r.left}</span><span>{r.pct}%</span>
                        </div>
                        <AnimatedBar pct={r.pct} primary={theme.primary} accent={theme.accent} />
                      </div>
                    ))}
                  </div>
                </ScrollBox>
              </GlassCard>
            </div>

            <BadgesCard theme={theme} delay={280} from="bottom" unlocked={unlockedBadges} t={t} lang={lang} />
          </div>
        )}

        {/* ---------- ACTIVITY TAB ---------- */}
        {activeTab === "activity" && (
          <div key="activity" className="tab-content" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>
              <GlassCard title={t("mentalState")} from="left" delay={0}>
                <ScrollBox maxHeight={280} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {dayNumbers.map((d) => {
                      const rec = mood[ymd(year, month, d)] || {};
                      const moodKey = `mood_${d}_mood`, motKey = `mood_${d}_motivation`;
                      return (
                        <div key={d} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 11, borderBottom: `1px solid rgba(255,255,255,0.06)`, paddingBottom: 8 }}>
                          <span style={{ width: 48, color: C.muted, flexShrink: 0, fontWeight: 600 }}>{t("day")} {d}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 58, color: C.muted }}>{t("mood")}</span>
                            <DotPicker value={rec.mood} color={C.green} onSelect={(v) => setMoodValue(d, "mood", v)} poppedIndex={pulseCell === moodKey ? (rec.mood ?? 1) - 1 : null} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 76, color: C.muted }}>{t("motivation")}</span>
                            <DotPicker value={rec.motivation} color={C.amber} onSelect={(v) => setMoodValue(d, "motivation", v)} poppedIndex={pulseCell === motKey ? (rec.motivation ?? 1) - 1 : null} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollBox>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={stats.moodSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} />
                    <YAxis
                      domain={[1, 10]}
                      ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      width={30}
                      tick={{ fontSize: 14 }}
                      tickFormatter={(v) => MOOD_EMOJIS[v - 1] || ""}
                      axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v, name) => [`${MOOD_EMOJIS[Math.round(v) - 1] || v} (${v})`, name]}
                      contentStyle={{ fontSize: 11, background: "#1a1030", border: `1px solid ${C.glassBorder}`, borderRadius: 10 }}
                    />
                    <Line type="monotone" dataKey="mood" stroke={C.green} dot={false} connectNulls strokeWidth={2.5} isAnimationActive animationDuration={900} animationEasing="ease-out" />
                    <Line type="monotone" dataKey="motivation" stroke={C.amber} dot={false} connectNulls strokeWidth={2.5} isAnimationActive animationDuration={900} animationEasing="ease-out" animationBegin={150} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title={t("top10")} from="right" delay={110}>
                <ScrollBox maxHeight={440}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {stats.top10.map((r, i) => (
                      <div key={r.habit.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "5px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                        <span style={{ width: 18, color: theme.primary, fontWeight: 700 }}>{i + 1}</span>
                        <span>{r.habit.emoji}</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.habit.name}</span>
                        <span style={{ color: theme.accent, fontWeight: 600 }}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </ScrollBox>
              </GlassCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <MotivationCard theme={theme} delay={200} from="bottom" t={t} lang={lang} />
              <QuoteCard theme={theme} delay={230} from="bottom" t={t} lang={lang} quoteIndex={quoteIndex} onNext={nextQuote} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <JournalCard
                theme={theme}
                delay={260}
                from="bottom"
                entries={journalEntries}
                title={journalTitle}
                text={journalText}
                error={journalError}
                onTitleChange={setJournalTitle}
                onTextChange={setJournalText}
                onSave={saveJournalEntry}
                t={t}
                fullDateTimeLabel={fullDateTimeLabel}
                expandedId={expandedEntryId}
                onToggleExpand={(id) => setExpandedEntryId((prev) => (prev === id ? null : id))}
              />
              <WaterCard theme={theme} delay={290} from="bottom" water={water} onSet={setWaterValue} t={t} dayLabel={dayLabel} fullDateTimeLabel={fullDateTimeLabel} />
            </div>

            <FoodTrackerCard theme={theme} delay={320} from="bottom" meals={meals} onLog={logMeal} t={t} />
          </div>
        )}

        {/* ---------- EVENTS TAB ---------- */}
        {activeTab === "events" && (
          <div key="events" className="tab-content">
            <EventsCard theme={theme} events={events} onSave={saveEvent} onDelete={deleteEvent} onToggleDone={toggleEventDone} t={t} />
          </div>
        )}

        {/* ---------- CHALLENGES TAB ---------- */}
        {activeTab === "challenges" && (
          <div key="challenges" className="tab-content">
            <ChallengesCard
              theme={theme}
              difficulty={challengeDifficulty}
              onSelectDifficulty={selectChallengeDifficulty}
              isRolling={isRolling}
              rollingText={rollingText}
              history={challengeHistory}
              onRoll={rollChallengeDice}
              onToggleDone={toggleChallengeDone}
              unlockedBadges={unlockedChallengeBadges}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* ---------- ROUTINES TAB ---------- */}
        {activeTab === "routines" && (
          <div key="routines" className="tab-content">
            <RoutinesCard theme={theme} routines={routines} onAdd={addRoutine} onLog={logRoutine} onDelete={deleteRoutine} t={t} lang={lang} />
          </div>
        )}

        {/* ---------- GOALS TAB ---------- */}
        {activeTab === "goals" && (
          <div key="goals" className="tab-content">
            <GoalsCard theme={theme} goals={goals} onAdd={addGoal} onUpdateProgress={updateGoalProgress} onDelete={deleteGoal} t={t} />
          </div>
        )}
      </div>

      {/* ---------- credit widget ---------- */}
      <div className="glass-card credit-widget from-fade" style={{ position: "fixed", bottom: 14, right: 14, zIndex: 90, padding: "12px 16px", borderRadius: 18, display: "flex", flexDirection: "column", gap: 6, fontSize: 11, lineHeight: 1.3 }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.2, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 6px ${theme.accent}`, flexShrink: 0 }} />
          Credits: Amir Noori
        </div>
        <a href="https://instagram.com/tk_.amir.x" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: C.text, textDecoration: "none" }}>
          <span>📷</span><span>tk_.amir.x</span>
        </a>
        <a href="https://tiktok.com/@trader.amirx" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: C.text, textDecoration: "none" }}>
          <span>🎵</span><span>trader.amirx</span>
        </a>
      </div>
    </div>
  );
}

const selectStyle = {
  fontSize: 11, border: `1px solid ${C.glassBorder}`, borderRadius: 10, padding: "5px 8px",
  background: "rgba(255,255,255,0.05)", flex: 1, minWidth: 0,
};
