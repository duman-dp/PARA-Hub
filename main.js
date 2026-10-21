/* ============================================================
   PARA Hub — Complete Obsidian plugin
   Version 1.0.0 — Stable Release (Future-Proof Migration System)
   ============================================================ */

const { Plugin, ItemView, Modal, Setting, PluginSettingTab, Notice, normalizePath, setIcon, Menu } = require('obsidian');

const VIEW_TYPE = 'para-hub-view';
const MAX_RENDER = 100;
const CURRENT_SCHEMA_VERSION = 1; // Increase this if you change how data is saved in the future

const DEFAULT_FOLDERS = {
  inbox: 'Inbox',
  tasks: 'Tasks',
  projects: 'Projects',
  areas: 'Areas',
  resources: 'Resources',
  archives: 'Archives',
};

const TRANSLATIONS = {
  en: {
    nav_home: 'Home', nav_today: 'Today', nav_inbox: 'Inbox', nav_tasks: 'Tasks', nav_projects: 'Projects', nav_areas: 'Areas', nav_resources: 'Resources', nav_archives: 'Archives', nav_review: 'Weekly Review', nav_settings: 'Settings & Help',
    hero_title: 'Welcome back', hero_sub: 'Here is your day at a glance.',
    stat_due: 'Due today', stat_over: 'Overdue', stat_active: 'Active projects', stat_inbox: 'In Inbox',
    act_add_task: 'Add Task', act_capture: 'Quick Capture', act_new_proj: 'New Project', act_review: 'Weekly Review',
    panel_due: 'Tasks due today', panel_due_empty: 'You are all caught up. No tasks are due today.',
    panel_over: 'Overdue tasks', panel_over_empty: 'Nothing is overdue. Great job.',
    panel_up: 'Upcoming deadlines', panel_up_empty: 'Nothing due in the next seven days.',
    panel_active: 'Active projects', panel_active_empty: 'No active projects yet.',
    panel_att: 'Projects needing attention', panel_att_empty: 'Everything looks healthy.',
    panel_recent: 'Recently added', panel_recent_empty: 'Nothing yet. Add your first task or capture a quick note.',
    panel_summary: 'Progress summary', sum_tasks: 'Tasks completed:', sum_proj: 'Active projects:', sum_inbox: 'Items waiting in Inbox:',
    btn_add_task: 'Add Task', btn_capture: 'Quick Capture', btn_new_proj: 'New Project', btn_new_area: 'New Area', btn_new_res: 'New Resource', btn_back: 'Back',
    btn_open: 'Open', btn_edit: 'Edit', btn_archive: 'Archive', btn_restore: 'Restore', btn_assign: 'Assign', btn_more: 'More options', btn_actions: 'Actions', btn_go: 'Go', btn_reset: 'Reset progress',
    tab_today: 'Today', tab_over: 'Overdue', tab_up: 'Upcoming', tab_high: 'High Priority', tab_open: 'All Open', tab_comp: 'Completed', tab_proj: 'By Project',
    empty_tasks: 'No tasks found.', empty_inbox: 'Your Inbox is empty. Use Quick Capture when something comes to mind.',
    empty_proj: 'No projects yet. A project is anything with a finish line.', empty_area: 'No areas yet. An area is something you maintain, like Health or Finances.',
    empty_res: 'No resources yet. Resources are things you want to keep for reference.', empty_arch: 'Nothing is archived.',
    task_no_tasks: 'No tasks in this view.', task_showing: 'Showing the first 100 tasks. Use Search to find others.',
    task_mark_inc: 'Mark task incomplete', task_mark_comp: 'Mark task complete', task_missing: 'Missing:',
    inbox_cat: 'Category:', inbox_archived: 'Archived', inbox_updated: 'Inbox item updated',
    proj_blocked: 'Blocked', proj_over: 'Overdue', proj_soon: 'Due soon', proj_inactive: 'Inactive', proj_no_prog: 'Progress not available yet', proj_tasks_done: 'tasks completed',
    proj_outcome: 'Outcome:', proj_desc: 'Description:', proj_status: 'Status:', proj_prio: 'Priority:', proj_deadline: 'Deadline:', proj_area: 'Area:', proj_area_missing: 'Linked area missing:',
    proj_progress: 'Progress', proj_add_task_ph: 'Add a task to this project…', proj_add: 'Add', proj_no_tasks: 'No tasks yet. Add one above.',
    proj_res: 'Related resources', proj_no_res: 'No resources linked yet.', proj_edit: 'Edit Project', proj_comp: 'Mark Complete',
    area_proj: 'Projects in this area', area_no_proj: 'No projects.', area_tasks: 'Tasks in this area', area_no_tasks: 'No tasks.', area_res: 'Resources in this area', area_no_res: 'No resources.',
    res_link: 'Link:', res_cat: 'Category:',
    arch_desc: 'Nothing here is deleted. Restore anything with one click.', arch_type: 'Type:',
    rev_desc: 'A guided checklist to help you reflect and plan.',
    rev_1: 'Review Inbox', rev_1_h: 'Sort or leave anything in your Inbox.',
    rev_2: 'Clear overdue tasks', rev_2_h: 'Complete, reschedule, or archive overdue tasks.',
    rev_3: 'Check upcoming deadlines', rev_3_h: 'Look at what is due in the next two weeks.',
    rev_4: 'Review active projects', rev_4_h: 'Open each active project and check its status.',
    rev_5: 'Look at blocked or neglected', rev_5_h: 'Flag anything that has stalled.',
    rev_6: 'Update priorities', rev_6_h: 'Raise or lower what matters most this week.',
    rev_7: 'Complete or archive finished', rev_7_h: 'If a project is done, mark it complete or archive it.',
    rev_8: 'Define next actions', rev_8_h: 'Add at least one next task for every active project.',
    rev_9: 'Prepare for the week', rev_9_h: 'Write down your top three priorities.',
    search_results: 'Search results', search_empty: 'Type something in the search box at the top.', search_none: 'No matches for', search_open: 'Open note',
    set_para: 'What is PARA?', set_para_desc: 'PARA is a way of organising everything in your life into five buckets: Projects (outcomes to finish), Areas (ongoing responsibilities), Resources (reference material), Archives (inactive things, never deleted) and an Inbox (a temporary holding area).',
    set_actions: 'Common actions', set_a1: 'Add a task: click "Add Task" on the Home screen.', set_a2: 'Capture a thought: click "Quick Capture" on the Home screen, or use the command palette.', set_a3: 'Start a project: click "New Project".', set_a4: 'Weekly review: click "Weekly Review" and tick each step.', set_a5: 'Back up: click "Back up now" below.',
    set_tools: 'Tools', set_backup: 'Back up now', set_reset: 'Show welcome screen again', set_remove: 'Remove sample content',
    set_title: 'PARA Hub Settings', set_desc: 'These settings control where your notes live. Changing a folder name does not move your existing notes; it only changes where new notes will be saved.',
    set_lang: 'Language', set_lang_desc: 'Choose the language for the interface.',
    set_lbl_inbox: 'Inbox notes', set_lbl_tasks: 'Task notes', set_lbl_proj: 'Project notes', set_lbl_area: 'Area notes', set_lbl_res: 'Resource notes', set_lbl_arch: 'Archive notes', set_lbl_folder: 'Folder name',
    set_show_again: 'Show the welcome screen again', set_show_desc: 'Turns the first-run welcome back on.', set_show_btn: 'Show again',
    set_backup_title: 'Back up your PARA data', set_backup_desc: 'Writes a dated copy of your PARA notes into your Archive folder. This is a readable copy, not a full vault backup.',
    onb_title: 'Welcome to PARA Hub', onb_sub: 'A simple way to organise everything in your vault.',
    onb_p: 'Projects', onb_pd: 'outcomes to finish', onb_a: 'Areas', onb_ad: 'ongoing responsibilities', onb_r: 'Resources', onb_rd: 'reference material', onb_ar: 'Archives', onb_ard: 'inactive things (never deleted)', onb_i: 'Inbox', onb_id: 'temporary holding area',
    onb_t_btn: 'Create your first task', onb_p_btn: 'Create your first project', onb_skip: 'Skip', onb_sample: 'Not sure where to start? Add a small set of sample items labelled "Sample:" — you can remove them with one button.', onb_add_sample: 'Add sample content',
    mod_cap: 'Quick Capture', mod_cap_desc: 'Anything you type here lands in your Inbox. You can sort it later.',
    mod_title_req: 'Title (required)', mod_content: 'Content (optional)', mod_cat: 'Category (optional)', mod_save_inbox: 'Save to Inbox', mod_cancel: 'Cancel',
    mod_task: 'Add Task', mod_edit_task: 'Edit Task', mod_desc: 'Description (optional)', mod_due: 'Due date (optional)', mod_prio: 'Priority', mod_status: 'Status', mod_proj: 'Related project (optional)', mod_area: 'Related area (optional)', mod_notes: 'Notes (optional)', mod_save_task: 'Save Task',
    mod_new_proj: 'New Project', mod_edit_proj: 'Edit Project', mod_name_req: 'Name (required)', mod_outcome: 'Desired outcome', mod_desc_req: 'Description', mod_init_tasks: 'Initial tasks (one per line, optional)', mod_save_proj: 'Save Project',
    mod_new_area: 'New Area', mod_edit_area: 'Edit Area', mod_save_area: 'Save Area',
    mod_new_res: 'New Resource', mod_edit_res: 'Edit Resource', mod_link: 'Link (optional)', mod_save_res: 'Save Resource',
    mod_assign: 'Assign Inbox Item', mod_assign_desc: 'Link this item to a project, area, or resource — or send it to Archives.', mod_dest: 'Choose a destination', mod_leave: '— Leave in Inbox —', mod_do_assign: 'Assign',
    err_title: 'Please enter a title', err_name: 'Please enter a name', err_save: 'Could not save. Please try again.', err_update: 'Could not update. Please try again.', err_arch: 'Could not archive. Please try again.', err_restore: 'Could not restore. Please try again.', err_backup: 'Could not back up. Please try again.',
    msg_saved: 'Saved', msg_archived: 'Archived', msg_restored: 'Restored', msg_proj_comp: 'Project completed', msg_backup: 'Backup saved to your Archive folder', msg_sample_add: 'Sample content added', msg_sample_rem: 'Removed',
    opt_none: '— None —', opt_low: 'Low', opt_med: 'Medium', opt_high: 'High', opt_open: 'Open', opt_comp: 'Completed', opt_blocked: 'Blocked', opt_active: 'Active', opt_inactive: 'Inactive',
    date_unknown: 'Unknown'
  },
  de: {
    nav_home: 'Startseite', nav_today: 'Heute', nav_inbox: 'Eingang', nav_tasks: 'Aufgaben', nav_projects: 'Projekte', nav_areas: 'Bereiche', nav_resources: 'Ressourcen', nav_archives: 'Archiv', nav_review: 'Wochenrückblick', nav_settings: 'Einstellungen & Hilfe',
    hero_title: 'Willkommen zurück', hero_sub: 'Hier ist Ihr Tag auf einen Blick.',
    stat_due: 'Heute fällig', stat_over: 'Überfällig', stat_active: 'Aktive Projekte', stat_inbox: 'Im Eingang',
    act_add_task: 'Aufgabe hinzufügen', act_capture: 'Schnellerfassung', act_new_proj: 'Neues Projekt', act_review: 'Wochenrückblick',
    panel_due: 'Heute fällige Aufgaben', panel_due_empty: 'Sie sind auf dem neuesten Stand. Heute sind keine Aufgaben fällig.',
    panel_over: 'Überfällige Aufgaben', panel_over_empty: 'Nichts ist überfällig. Gute Arbeit.',
    panel_up: 'Anstehende Fristen', panel_up_empty: 'In den nächsten sieben Tagen ist nichts fällig.',
    panel_active: 'Aktive Projekte', panel_active_empty: 'Noch keine aktiven Projekte.',
    panel_att: 'Projekte, die Aufmerksamkeit benötigen', panel_att_empty: 'Alles sieht gut aus.',
    panel_recent: 'Kürzlich hinzugefügt', panel_recent_empty: 'Noch nichts vorhanden. Fügen Sie Ihre erste Aufgabe hinzu oder erfassen Sie eine kurze Notiz.',
    panel_summary: 'Fortschrittsübersicht', sum_tasks: 'Abgeschlossene Aufgaben:', sum_proj: 'Aktive Projekte:', sum_inbox: 'Elemente im Eingang:',
    btn_add_task: 'Aufgabe hinzufügen', btn_capture: 'Schnellerfassung', btn_new_proj: 'Neues Projekt', btn_new_area: 'Neuer Bereich', btn_new_res: 'Neue Ressource', btn_back: 'Zurück',
    btn_open: 'Öffnen', btn_edit: 'Bearbeiten', btn_archive: 'Archivieren', btn_restore: 'Wiederherstellen', btn_assign: 'Zuweisen', btn_more: 'Weitere Optionen', btn_actions: 'Aktionen', btn_go: 'Los', btn_reset: 'Fortschritt zurücksetzen',
    tab_today: 'Heute', tab_over: 'Überfällig', tab_up: 'Anstehend', tab_high: 'Hohe Priorität', tab_open: 'Alle offenen', tab_comp: 'Abgeschlossen', tab_proj: 'Nach Projekt',
    empty_tasks: 'Keine Aufgaben gefunden.', empty_inbox: 'Ihr Eingang ist leer. Verwenden Sie die Schnellerfassung, wenn Ihnen etwas einfällt.',
    empty_proj: 'Noch keine Projekte. Ein Projekt ist alles, was ein Ziel hat.', empty_area: 'Noch keine Bereiche. Ein Bereich ist etwas, das Sie pflegen, wie Gesundheit oder Finanzen.',
    empty_res: 'Noch keine Ressourcen. Ressourcen sind Dinge, die Sie als Referenz aufbewahren möchten.', empty_arch: 'Nichts ist archiviert.',
    task_no_tasks: 'Keine Aufgaben in dieser Ansicht.', task_showing: 'Zeige die ersten 100 Aufgaben. Verwenden Sie die Suche, um andere zu finden.',
    task_mark_inc: 'Aufgabe als unerledigt markieren', task_mark_comp: 'Aufgabe als erledigt markieren', task_missing: 'Fehlend:',
    inbox_cat: 'Kategorie:', inbox_archived: 'Archiviert', inbox_updated: 'Eingangselement aktualisiert',
    proj_blocked: 'Blockiert', proj_over: 'Überfällig', proj_soon: 'Bald fällig', proj_inactive: 'Inaktiv', proj_no_prog: 'Fortschritt noch nicht verfügbar', proj_tasks_done: 'Aufgaben abgeschlossen',
    proj_outcome: 'Ergebnis:', proj_desc: 'Beschreibung:', proj_status: 'Status:', proj_prio: 'Priorität:', proj_deadline: 'Frist:', proj_area: 'Bereich:', proj_area_missing: 'Verknüpfter Bereich fehlt:',
    proj_progress: 'Fortschritt', proj_add_task_ph: 'Fügen Sie diesem Projekt eine Aufgabe hinzu…', proj_add: 'Hinzufügen', proj_no_tasks: 'Noch keine Aufgaben. Fügen Sie oben eine hinzu.',
    proj_res: 'Zugehörige Ressourcen', proj_no_res: 'Noch keine Ressourcen verknüpft.', proj_edit: 'Projekt bearbeiten', proj_comp: 'Als abgeschlossen markieren',
    area_proj: 'Projekte in diesem Bereich', area_no_proj: 'Keine Projekte.', area_tasks: 'Aufgaben in diesem Bereich', area_no_tasks: 'Keine Aufgaben.', area_res: 'Ressourcen in diesem Bereich', area_no_res: 'Keine Ressourcen.',
    res_link: 'Link:', res_cat: 'Kategorie:',
    arch_desc: 'Hier wird nichts gelöscht. Stellen Sie alles mit einem Klick wieder her.', arch_type: 'Typ:',
    rev_desc: 'Eine geführte Checkliste, die Ihnen hilft, zu reflektieren und zu planen.',
    rev_1: 'Eingang überprüfen', rev_1_h: 'Sortieren Sie den Eingang oder lassen Sie ihn unverändert.',
    rev_2: 'Überfällige Aufgaben erledigen', rev_2_h: 'Schließen Sie überfällige Aufgaben ab, verschieben Sie sie oder archivieren Sie sie.',
    rev_3: 'Anstehende Fristen prüfen', rev_3_h: 'Sehen Sie sich an, was in den nächsten zwei Wochen fällig ist.',
    rev_4: 'Aktive Projekte überprüfen', rev_4_h: 'Öffnen Sie jedes aktive Projekt und prüfen Sie den Status.',
    rev_5: 'Blockierte/vernachlässigte Projekte ansehen', rev_5_h: 'Markieren Sie alles, was ins Stocken geraten ist.',
    rev_6: 'Prioritäten aktualisieren', rev_6_h: 'Erhöhen oder senken Sie die Priorität, was diese Woche am wichtigsten ist.',
    rev_7: 'Abgeschlossene Projekte abschließen oder archivieren', rev_7_h: 'Wenn ein Projekt fertig ist, markieren Sie es als abgeschlossen oder archivieren Sie es.',
    rev_8: 'Nächste Schritte definieren', rev_8_h: 'Fügen Sie für jedes aktive Projekt mindestens eine nächste Aufgabe hinzu.',
    rev_9: 'Für die Woche vorbereiten', rev_9_h: 'Notieren Sie Ihre drei wichtigsten Prioritäten.',
    search_results: 'Suchergebnisse', search_empty: 'Geben Sie etwas in das Suchfeld oben ein.', search_none: 'Keine Treffer für', search_open: 'Notiz öffnen',
    set_para: 'Was ist PARA?', set_para_desc: 'PARA ist eine Methode, um alles in Ihrem Leben in fünf Kategorien zu organisieren: Projekte (Ziele, die abgeschlossen werden müssen), Bereiche (laufende Verantwortlichkeiten), Ressourcen (Referenzmaterial), Archiv (inaktive Dinge, die niemals gelöscht werden) und Eingang (vorübergehender Speicherort).',
    set_actions: 'Häufige Aktionen', set_a1: 'Aufgabe hinzufügen: Klicken Sie auf "Aufgabe hinzufügen" auf dem Startbildschirm.', set_a2: 'Gedanken erfassen: Klicken Sie auf "Schnellerfassung" auf dem Startbildschirm.', set_a3: 'Projekt starten: Klicken Sie auf "Neues Projekt".', set_a4: 'Wochenrückblick: Klicken Sie auf "Wochenrückblick" und haken Sie jeden Schritt ab.', set_a5: 'Sichern: Klicken Sie unten auf "Jetzt sichern".',
    set_tools: 'Werkzeuge', set_backup: 'Jetzt sichern', set_reset: 'Willkommensbildschirm erneut anzeigen', set_remove: 'Beispielinhalte entfernen',
    set_title: 'PARA Hub Einstellungen', set_desc: 'Diese Einstellungen legen fest, wo Ihre Notizen gespeichert werden. Das Ändern eines Ordnernamens verschiebt Ihre vorhandenen Notizen nicht; es ändert nur, wo neue Notizen gespeichert werden.',
    set_lang: 'Sprache', set_lang_desc: 'Wählen Sie die Sprache für die Benutzeroberfläche.',
    set_lbl_inbox: 'Eingangsnotizen', set_lbl_tasks: 'Aufgabennotizen', set_lbl_proj: 'Projektnotizen', set_lbl_area: 'Bereichsnotizen', set_lbl_res: 'Ressourcennotizen', set_lbl_arch: 'Archivnotizen', set_lbl_folder: 'Ordnername',
    set_show_again: 'Willkommensbildschirm erneut anzeigen', set_show_desc: 'Schaltet den ersten Willkommensbildschirm wieder ein.', set_show_btn: 'Erneut anzeigen',
    set_backup_title: 'Sichern Sie Ihre PARA-Daten', set_backup_desc: 'Schreibt eine datierte Kopie Ihrer PARA-Notizen in Ihren Archivordner. Dies ist eine lesbare Kopie, kein vollständiges Vault-Backup.',
    onb_title: 'Willkommen bei PARA Hub', onb_sub: 'Eine einfache Möglichkeit, alles in Ihrem Vault zu organisieren.',
    onb_p: 'Projekte', onb_pd: 'Ziele, die abgeschlossen werden müssen', onb_a: 'Bereiche', onb_ad: 'laufende Verantwortlichkeiten', onb_r: 'Ressourcen', onb_rd: 'Referenzmaterial', onb_ar: 'Archiv', onb_ard: 'inaktive Dinge (niemals gelöscht)', onb_i: 'Eingang', onb_id: 'vorübergehender Speicherort',
    onb_t_btn: 'Erstellen Sie Ihre erste Aufgabe', onb_p_btn: 'Erstellen Sie Ihr erstes Projekt', onb_skip: 'Überspringen', onb_sample: 'Nicht sicher, wo Sie anfangen sollen? Fügen Sie einige Beispielaufgaben hinzu (mit "Sample:" gekennzeichnet) — Sie können sie mit einem Klick entfernen.', onb_add_sample: 'Beispielinhalte hinzufügen',
    mod_cap: 'Schnellerfassung', mod_cap_desc: 'Alles, was Sie hier eingeben, landet in Ihrem Eingang. Sie können es später sortieren.',
    mod_title_req: 'Titel (erforderlich)', mod_content: 'Inhalt (optional)', mod_cat: 'Kategorie (optional)', mod_save_inbox: 'Im Eingang speichern', mod_cancel: 'Abbrechen',
    mod_task: 'Aufgabe hinzufügen', mod_edit_task: 'Aufgabe bearbeiten', mod_desc: 'Beschreibung (optional)', mod_due: 'Fälligkeitsdatum (optional)', mod_prio: 'Priorität', mod_status: 'Status', mod_proj: 'Zugehöriges Projekt (optional)', mod_area: 'Zugehöriger Bereich (optional)', mod_notes: 'Notizen (optional)', mod_save_task: 'Aufgabe speichern',
    mod_new_proj: 'Neues Projekt', mod_edit_proj: 'Projekt bearbeiten', mod_name_req: 'Name (erforderlich)', mod_outcome: 'Gewünschtes Ergebnis', mod_desc_req: 'Beschreibung', mod_init_tasks: 'Erste Aufgaben (eine pro Zeile, optional)', mod_save_proj: 'Projekt speichern',
    mod_new_area: 'Neuer Bereich', mod_edit_area: 'Bereich bearbeiten', mod_save_area: 'Bereich speichern',
    mod_new_res: 'Neue Ressource', mod_edit_res: 'Ressource bearbeiten', mod_link: 'Link (optional)', mod_save_res: 'Ressource speichern',
    mod_assign: 'Eingangselement zuweisen', mod_assign_desc: 'Verknüpfen Sie dieses Element mit einem Projekt, Bereich oder einer Ressource — oder senden Sie es ins Archiv.', mod_dest: 'Wählen Sie ein Ziel', mod_leave: '— Im Eingang lassen —', mod_do_assign: 'Zuweisen',
    err_title: 'Bitte geben Sie einen Titel ein', err_name: 'Bitte geben Sie einen Namen ein', err_save: 'Konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.', err_update: 'Konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.', err_arch: 'Konnte nicht archiviert werden. Bitte versuchen Sie es erneut.', err_restore: 'Konnte nicht wiederhergestellt werden. Bitte versuchen Sie es erneut.', err_backup: 'Sicherung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    msg_saved: 'Gespeichert', msg_archived: 'Archiviert', msg_restored: 'Wiederhergestellt', msg_proj_comp: 'Projekt abgeschlossen', msg_backup: 'Sicherung im Archivordner gespeichert', msg_sample_add: 'Beispielinhalte hinzugefügt', msg_sample_rem: 'Entfernt',
    opt_none: '— Keine —', opt_low: 'Niedrig', opt_med: 'Mittel', opt_high: 'Hoch', opt_open: 'Offen', opt_comp: 'Abgeschlossen', opt_blocked: 'Blockiert', opt_active: 'Aktiv', opt_inactive: 'Inaktiv',
    date_unknown: 'Unbekannt'
  }
};

const REVIEW_STEPS = [
  { key: 'inbox',      titleKey: 'rev_1', hintKey: 'rev_1_h', screen: 'inbox' },
  { key: 'overdue',    titleKey: 'rev_2', hintKey: 'rev_2_h', screen: 'tasks', taskFilter: 'overdue' },
  { key: 'upcoming',   titleKey: 'rev_3', hintKey: 'rev_3_h', screen: 'tasks', taskFilter: 'upcoming' },
  { key: 'projects',   titleKey: 'rev_4', hintKey: 'rev_4_h', screen: 'projects' },
  { key: 'blocked',    titleKey: 'rev_5', hintKey: 'rev_5_h', screen: 'projects' },
  { key: 'priorities', titleKey: 'rev_6', hintKey: 'rev_6_h', screen: 'tasks', taskFilter: 'open' },
  { key: 'finished',   titleKey: 'rev_7', hintKey: 'rev_7_h', screen: 'projects' },
  { key: 'next',       titleKey: 'rev_8', hintKey: 'rev_8_h', screen: 'tasks', taskFilter: 'open' },
  { key: 'prepare',    titleKey: 'rev_9', hintKey: 'rev_9_h', screen: 'review' },
];

/* ---------------- small helpers ---------------- */

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function nowISO() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function safeFilename(title) {
  const base = String(title || 'Untitled')
    .replace(/[\\/:*?"<>|#^\[\]]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return base || 'Untitled';
}

function parseNote(content) {
  if (!content || content.indexOf('---') !== 0) {
    return { fm: {}, body: content || '' };
  }
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { fm: {}, body: content };
  const fmText = content.slice(3, end).replace(/^\n/, '');
  const body = content.slice(end + 4).replace(/^\n+/, '');
  const fm = {};
  for (const line of fmText.split('\n')) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let value = m[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"');
    } else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^-?\d+$/.test(value)) value = parseInt(value, 10);
    fm[key] = value;
  }
  return { fm, body };
}

function serializeNote(fm, body) {
  const lines = [];
  for (const key of Object.keys(fm)) {
    const v = fm[key];
    if (v === undefined || v === null) continue;
    let str = String(v);
    if (/[:#\n]/.test(str) || str !== str.trim()) {
      str = '"' + str.replace(/"/g, '\\"') + '"';
    }
    lines.push(key + ': ' + str);
  }
  return '---\n' + lines.join('\n') + '\n---\n\n' + (body || '');
}

/* ============================================================
   MODALS
   ============================================================ */

class QuickCaptureModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.saving = false;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t('mod_cap') });
    contentEl.createEl('p', { text: this.plugin.t('mod_cap_desc') });

    contentEl.createEl('label', { text: this.plugin.t('mod_title_req') }).addClass('para-label');
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input', placeholder: 'Short title' });

    contentEl.createEl('label', { text: this.plugin.t('mod_content') }).addClass('para-label');
    this.contentInput = contentEl.createEl('textarea', { cls: 'para-textarea', placeholder: 'Details you want to remember' });

    contentEl.createEl('label', { text: this.plugin.t('mod_cat') }).addClass('para-label');
    this.categoryInput = contentEl.createEl('input', { type: 'text', cls: 'para-input', placeholder: 'e.g. Idea, To Read' });

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('mod_save_inbox'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', () => this.save());

    setTimeout(() => this.titleInput.focus(), 50);
  }
  async save() {
    if (this.saving) return;
    const title = this.titleInput.value.trim();
    if (!title) {
      new Notice(this.plugin.t('err_title'));
      this.titleInput.focus();
      return;
    }
    this.saving = true;
    try {
      const fm = {
        'para-type': 'inbox',
        'para-id': makeId(),
        'title': title,
        'category': this.categoryInput.value.trim(),
        'created': nowISO(),
        'archived': false,
      };
      await this.plugin.createNote('inbox', title, fm, this.contentInput.value.trim());
      new Notice(this.plugin.t('msg_saved'));
      this.close();
      this.plugin.refreshAll();
    } catch (e) {
      console.error(e);
      new Notice(this.plugin.t('err_save'));
      this.saving = false;
    }
  }
  onClose() { this.contentEl.empty(); }
}

class TaskModal extends Modal {
  constructor(app, plugin, existing, onDone) {
    super(app);
    this.plugin = plugin;
    this.existing = existing;
    this.onDone = onDone;
    this.saving = false;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t(this.existing ? 'mod_edit_task' : 'mod_task') });

    const fm = this.existing ? this.existing.fm : {};
    const projects = await this.plugin.getNotes('projects');
    const areas = await this.plugin.getNotes('areas');

    contentEl.createEl('label', { text: this.plugin.t('mod_title_req') }).addClass('para-label');
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.titleInput.value = fm.title || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_desc') }).addClass('para-label');
    this.descInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.descInput.value = fm.description || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_due') }).addClass('para-label');
    this.dueInput = contentEl.createEl('input', { type: 'date', cls: 'para-input' });
    this.dueInput.value = fm.due || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_prio') }).addClass('para-label');
    this.prioSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.prioSelect.createEl('option', { value: 'low', text: this.plugin.t('opt_low') });
    this.prioSelect.createEl('option', { value: 'medium', text: this.plugin.t('opt_med') });
    this.prioSelect.createEl('option', { value: 'high', text: this.plugin.t('opt_high') });
    this.prioSelect.value = (fm.priority || 'medium').toLowerCase();

    contentEl.createEl('label', { text: this.plugin.t('mod_status') }).addClass('para-label');
    this.statusSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.statusSelect.createEl('option', { value: 'open', text: this.plugin.t('opt_open') });
    this.statusSelect.createEl('option', { value: 'completed', text: this.plugin.t('opt_comp') });
    this.statusSelect.createEl('option', { value: 'blocked', text: this.plugin.t('opt_blocked') });
    this.statusSelect.value = (fm.status || 'open').toLowerCase();

    contentEl.createEl('label', { text: this.plugin.t('mod_proj') }).addClass('para-label');
    this.projectSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.projectSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const p of projects) {
      this.projectSelect.createEl('option', { value: p.fm.title || p.file.basename, text: p.fm.title || p.file.basename });
    }
    this.projectSelect.value = fm.project || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_area') }).addClass('para-label');
    this.areaSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.areaSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const a of areas) {
      this.areaSelect.createEl('option', { value: a.fm.title || a.file.basename, text: a.fm.title || a.file.basename });
    }
    this.areaSelect.value = fm.area || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_notes') }).addClass('para-label');
    this.notesInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.notesInput.value = this.existing ? this.existing.body : '';

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('mod_save_task'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', () => this.save());

    setTimeout(() => this.titleInput.focus(), 50);
  }
  async save() {
    if (this.saving) return;
    const title = this.titleInput.value.trim();
    if (!title) { new Notice(this.plugin.t('err_title')); this.titleInput.focus(); return; }
    this.saving = true;
    try {
      const fm = {
        'para-type': 'task',
        'para-id': (this.existing && this.existing.fm['para-id']) || makeId(),
        'title': title,
        'description': this.descInput.value.trim(),
        'due': this.dueInput.value || '',
        'priority': this.prioSelect.value,
        'status': this.statusSelect.value,
        'project': this.projectSelect.value,
        'area': this.areaSelect.value,
        'created': (this.existing && this.existing.fm.created) || nowISO(),
        'archived': (this.existing && this.existing.fm.archived) || false,
      };
      const body = this.notesInput.value.trim();
      if (this.existing) {
        await this.plugin.updateNote(this.existing.file, fm, body);
      } else {
        await this.plugin.createNote('tasks', title, fm, body);
      }
      new Notice(this.plugin.t('msg_saved'));
      this.close();
      this.plugin.refreshAll();
      if (this.onDone) this.onDone();
    } catch (e) {
      console.error(e);
      new Notice(this.plugin.t('err_save'));
      this.saving = false;
    }
  }
  onClose() { this.contentEl.empty(); }
}

class ProjectModal extends Modal {
  constructor(app, plugin, existing, onDone) {
    super(app);
    this.plugin = plugin;
    this.existing = existing;
    this.onDone = onDone;
    this.saving = false;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t(this.existing ? 'mod_edit_proj' : 'mod_new_proj') });
    const fm = this.existing ? this.existing.fm : {};
    const areas = await this.plugin.getNotes('areas');

    contentEl.createEl('label', { text: this.plugin.t('mod_name_req') }).addClass('para-label');
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.titleInput.value = fm.title || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_outcome') }).addClass('para-label');
    this.outcomeInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.outcomeInput.value = fm.outcome || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_desc_req') }).addClass('para-label');
    this.descInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.descInput.value = fm.description || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_status') }).addClass('para-label');
    this.statusSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.statusSelect.createEl('option', { value: 'active', text: this.plugin.t('opt_active') });
    this.statusSelect.createEl('option', { value: 'blocked', text: this.plugin.t('opt_blocked') });
    this.statusSelect.createEl('option', { value: 'completed', text: this.plugin.t('opt_comp') });
    this.statusSelect.createEl('option', { value: 'inactive', text: this.plugin.t('opt_inactive') });
    this.statusSelect.value = (fm.status || 'active').toLowerCase();

    contentEl.createEl('label', { text: this.plugin.t('mod_prio') }).addClass('para-label');
    this.prioSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.prioSelect.createEl('option', { value: 'low', text: this.plugin.t('opt_low') });
    this.prioSelect.createEl('option', { value: 'medium', text: this.plugin.t('opt_med') });
    this.prioSelect.createEl('option', { value: 'high', text: this.plugin.t('opt_high') });
    this.prioSelect.value = (fm.priority || 'medium').toLowerCase();

    contentEl.createEl('label', { text: this.plugin.t('mod_due') }).addClass('para-label');
    this.deadlineInput = contentEl.createEl('input', { type: 'date', cls: 'para-input' });
    this.deadlineInput.value = fm.deadline || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_area') }).addClass('para-label');
    this.areaSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.areaSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const a of areas) {
      this.areaSelect.createEl('option', { value: a.fm.title || a.file.basename, text: a.fm.title || a.file.basename });
    }
    this.areaSelect.value = fm.area || '';

    if (!this.existing) {
      contentEl.createEl('label', { text: this.plugin.t('mod_init_tasks') }).addClass('para-label');
      this.initialTasksInput = contentEl.createEl('textarea', { cls: 'para-textarea', placeholder: 'One task per line' });
    } else {
      this.initialTasksInput = null;
    }

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('mod_save_proj'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', () => this.save());

    setTimeout(() => this.titleInput.focus(), 50);
  }
  async save() {
    if (this.saving) return;
    const title = this.titleInput.value.trim();
    if (!title) { new Notice(this.plugin.t('err_name')); this.titleInput.focus(); return; }
    this.saving = true;
    try {
      const fm = {
        'para-type': 'project',
        'para-id': (this.existing && this.existing.fm['para-id']) || makeId(),
        'title': title,
        'outcome': this.outcomeInput.value.trim(),
        'description': this.descInput.value.trim(),
        'status': this.statusSelect.value,
        'priority': this.prioSelect.value,
        'deadline': this.deadlineInput.value || '',
        'area': this.areaSelect.value,
        'created': (this.existing && this.existing.fm.created) || nowISO(),
        'archived': (this.existing && this.existing.fm.archived) || false,
      };
      let file;
      if (this.existing) {
        file = await this.plugin.updateNote(this.existing.file, fm);
      } else {
        file = await this.plugin.createNote('projects', title, fm, '');
      }
      if (this.initialTasksInput && this.initialTasksInput.value.trim()) {
        const lines = this.initialTasksInput.value.split('\n').map(s => s.trim()).filter(Boolean);
        for (const line of lines) {
          const tfm = {
            'para-type': 'task', 'para-id': makeId(), 'title': line,
            'description': '', 'due': '', 'priority': 'medium', 'status': 'open',
            'project': fm.title, 'area': fm.area || '',
            'created': nowISO(), 'archived': false,
          };
          await this.plugin.createNote('tasks', line, tfm, '');
        }
      }
      new Notice(this.plugin.t('msg_saved'));
      this.close();
      this.plugin.refreshAll();
      if (this.onDone) this.onDone();
    } catch (e) {
      console.error(e);
      new Notice(this.plugin.t('err_save'));
      this.saving = false;
    }
  }
  onClose() { this.contentEl.empty(); }
}

class AreaModal extends Modal {
  constructor(app, plugin, existing) {
    super(app);
    this.plugin = plugin;
    this.existing = existing;
    this.saving = false;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t(this.existing ? 'mod_edit_area' : 'mod_new_area') });
    const fm = this.existing ? this.existing.fm : {};

    contentEl.createEl('label', { text: this.plugin.t('mod_name_req') }).addClass('para-label');
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.titleInput.value = fm.title || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_desc_req') }).addClass('para-label');
    this.descInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.descInput.value = fm.description || '';

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('mod_save_area'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', () => this.save());

    setTimeout(() => this.titleInput.focus(), 50);
  }
  async save() {
    if (this.saving) return;
    const title = this.titleInput.value.trim();
    if (!title) { new Notice(this.plugin.t('err_name')); this.titleInput.focus(); return; }
    this.saving = true;
    try {
      const fm = {
        'para-type': 'area',
        'para-id': (this.existing && this.existing.fm['para-id']) || makeId(),
        'title': title,
        'description': this.descInput.value.trim(),
        'created': (this.existing && this.existing.fm.created) || nowISO(),
        'archived': (this.existing && this.existing.fm.archived) || false,
      };
      if (this.existing) {
        await this.plugin.updateNote(this.existing.file, fm);
      } else {
        await this.plugin.createNote('areas', title, fm, '');
      }
      new Notice(this.plugin.t('msg_saved'));
      this.close();
      this.plugin.refreshAll();
    } catch (e) {
      console.error(e);
      new Notice(this.plugin.t('err_save'));
      this.saving = false;
    }
  }
  onClose() { this.contentEl.empty(); }
}

class ResourceModal extends Modal {
  constructor(app, plugin, existing) {
    super(app);
    this.plugin = plugin;
    this.existing = existing;
    this.saving = false;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t(this.existing ? 'mod_edit_res' : 'mod_new_res') });
    const fm = this.existing ? this.existing.fm : {};
    const projects = await this.plugin.getNotes('projects');
    const areas = await this.plugin.getNotes('areas');

    contentEl.createEl('label', { text: this.plugin.t('mod_title_req') }).addClass('para-label');
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.titleInput.value = fm.title || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_desc_req') }).addClass('para-label');
    this.descInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.descInput.value = fm.description || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_cat') }).addClass('para-label');
    this.catInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.catInput.value = fm.category || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_link') }).addClass('para-label');
    this.urlInput = contentEl.createEl('input', { type: 'text', cls: 'para-input' });
    this.urlInput.value = fm.url || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_proj') }).addClass('para-label');
    this.projectSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.projectSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const p of projects) {
      this.projectSelect.createEl('option', { value: p.fm.title || p.file.basename, text: p.fm.title || p.file.basename });
    }
    this.projectSelect.value = fm.project || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_area') }).addClass('para-label');
    this.areaSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.areaSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const a of areas) {
      this.areaSelect.createEl('option', { value: a.fm.title || a.file.basename, text: a.fm.title || a.file.basename });
    }
    this.areaSelect.value = fm.area || '';

    contentEl.createEl('label', { text: this.plugin.t('mod_notes') }).addClass('para-label');
    this.notesInput = contentEl.createEl('textarea', { cls: 'para-textarea' });
    this.notesInput.value = this.existing ? this.existing.body : '';

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('mod_save_res'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', () => this.save());

    setTimeout(() => this.titleInput.focus(), 50);
  }
  async save() {
    if (this.saving) return;
    const title = this.titleInput.value.trim();
    if (!title) { new Notice(this.plugin.t('err_title')); this.titleInput.focus(); return; }
    this.saving = true;
    try {
      const fm = {
        'para-type': 'resource',
        'para-id': (this.existing && this.existing.fm['para-id']) || makeId(),
        'title': title,
        'description': this.descInput.value.trim(),
        'category': this.catInput.value.trim(),
        'url': this.urlInput.value.trim(),
        'project': this.projectSelect.value,
        'area': this.areaSelect.value,
        'created': (this.existing && this.existing.fm.created) || nowISO(),
        'archived': (this.existing && this.existing.fm.archived) || false,
      };
      const body = this.notesInput.value.trim();
      if (this.existing) {
        await this.plugin.updateNote(this.existing.file, fm, body);
      } else {
        await this.plugin.createNote('resources', title, fm, body);
      }
      new Notice(this.plugin.t('msg_saved'));
      this.close();
      this.plugin.refreshAll();
    } catch (e) {
      console.error(e);
      new Notice(this.plugin.t('err_save'));
      this.saving = false;
    }
  }
  onClose() { this.contentEl.empty(); }
}

class AssignModal extends Modal {
  constructor(app, plugin, note) {
    super(app);
    this.plugin = plugin;
    this.note = note;
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t('mod_assign') });
    contentEl.createEl('p', { text: this.plugin.t('mod_assign_desc') });

    const projects = await this.plugin.getNotes('projects');
    const areas = await this.plugin.getNotes('areas');
    const resources = await this.plugin.getNotes('resources');

    contentEl.createEl('label', { text: this.plugin.t('mod_dest') }).addClass('para-label');
    const select = contentEl.createEl('select', { cls: 'para-input' });
    select.createEl('option', { value: '', text: this.plugin.t('mod_leave') });
    const groupP = select.createEl('optgroup', { attr: { label: this.plugin.t('nav_projects') } });
    for (const p of projects) groupP.createEl('option', { value: 'project::' + (p.fm.title || p.file.basename), text: p.fm.title || p.file.basename });
    const groupA = select.createEl('optgroup', { attr: { label: this.plugin.t('nav_areas') } });
    for (const a of areas) groupA.createEl('option', { value: 'area::' + (a.fm.title || a.file.basename), text: a.fm.title || a.file.basename });
    const groupR = select.createEl('optgroup', { attr: { label: this.plugin.t('nav_resources') } });
    for (const r of resources) groupR.createEl('option', { value: 'resource::' + (r.fm.title || r.file.basename), text: r.fm.title || r.file.basename });
    const groupArc = select.createEl('optgroup', { attr: { label: this.plugin.t('nav_archives') } });
    groupArc.createEl('option', { value: 'archive::', text: this.plugin.t('btn_archive') });

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    const save = row.createEl('button', { text: this.plugin.t('btn_assign'), cls: 'para-btn para-btn-primary' });
    save.addEventListener('click', async () => {
      const val = select.value;
      if (!val) { this.close(); return; }
      const parts = val.split('::');
      const kind = parts[0];
      const name = parts[1];
      const fm = Object.assign({}, this.note.fm);
      if (kind === 'project') fm.project = name;
      else if (kind === 'area') fm.area = name;
      else if (kind === 'resource') fm.resource = name;
      else if (kind === 'archive') fm.archived = true;
      try {
        await this.plugin.updateNote(this.note.file, fm);
        new Notice(this.plugin.t('inbox_updated'));
        this.close();
        this.plugin.refreshAll();
      } catch (e) {
        console.error(e);
        new Notice(this.plugin.t('err_update'));
      }
    });
  }
  onClose() { this.contentEl.empty(); }
}

/* ============================================================
   MAIN VIEW
   ============================================================ */

class ParaHubView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'PARA Hub'; }
  getIcon() { return 'layout-dashboard'; }
  async onOpen() { await this.render(); }
  async onClose() { this.contentEl.empty(); }

  /* ---- small UI helpers ---- */

  iconButton(parent, icon, label, cls) {
    const btn = parent.createEl('button', { cls: 'para-icon-btn ' + (cls || '') });
    const ic = btn.createSpan({ cls: 'para-pill-icon' });
    setIcon(ic, icon);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    return btn;
  }

  panelHeader(panel, icon, text) {
    const h3 = panel.createEl('h3');
    const ic = h3.createSpan({ cls: 'para-panel-icon' });
    setIcon(ic, icon);
    h3.createSpan({ text });
    return h3;
  }

  renderEmpty(parent, icon, message, actionLabel, actionFn) {
    const box = parent.createDiv({ cls: 'para-empty-state' });
    const icWrap = box.createDiv({ cls: 'para-empty-icon' });
    setIcon(icWrap, icon);
    box.createEl('p', { cls: 'para-empty-msg', text: message });
    if (actionLabel && actionFn) {
      const btn = box.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const bIc = btn.createSpan({ cls: 'para-btn-icon' });
      setIcon(bIc, 'plus');
      btn.createSpan({ text: actionLabel });
      btn.addEventListener('click', actionFn);
    }
  }

  renderStat(parent, icon, value, label, onClick) {
    const card = parent.createEl('button', { cls: 'para-stat-card' });
    const icWrap = card.createDiv({ cls: 'para-stat-icon' });
    setIcon(icWrap, icon);
    const textWrap = card.createDiv({ cls: 'para-stat-text' });
    textWrap.createEl('div', { cls: 'para-stat-value', text: String(value) });
    textWrap.createEl('div', { cls: 'para-stat-label', text: label });
    if (onClick) card.addEventListener('click', onClick);
  }

  /* ---- top-level render ---- */

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass('para-hub');

    this.renderHeader(root);
    this.renderNav(root);

    const body = root.createDiv({ cls: 'para-body' });
    const state = this.plugin.state;

    try {
      switch (state.screen) {
        case 'home':      await this.renderHome(body); break;
        case 'today':     await this.renderTasks(body, 'today'); break;
        case 'inbox':     await this.renderInbox(body); break;
        case 'tasks':     await this.renderTasks(body, state.taskFilter || 'today'); break;
        case 'projects':  await this.renderProjects(body); break;
        case 'project':   await this.renderProjectDetail(body); break;
        case 'areas':     await this.renderAreas(body); break;
        case 'area':      await this.renderAreaDetail(body); break;
        case 'resources': await this.renderResources(body); break;
        case 'archives':  await this.renderArchives(body); break;
        case 'review':    await this.renderReview(body); break;
        case 'settings':  await this.renderSettings(body); break;
        case 'search':    await this.renderSearch(body); break;
        default:          await this.renderHome(body);
      }
    } catch (e) {
      console.error(e);
      body.createEl('p', { cls: 'para-error', text: this.plugin.t('err_save') });
    }

    if (!this.plugin.data.onboardingDone) {
      this.renderOnboarding(root);
    }
  }

  renderHeader(root) {
    const header = root.createDiv({ cls: 'para-header' });
    const titleRow = header.createDiv({ cls: 'para-title-row' });
    const titleIcon = titleRow.createDiv({ cls: 'para-title-icon' });
    setIcon(titleIcon, 'layout-dashboard');
    titleRow.createEl('h1', { text: 'PARA Hub', cls: 'para-title' });

    const searchWrap = header.createDiv({ cls: 'para-search-wrap' });
    const searchIcon = searchWrap.createDiv({ cls: 'para-search-icon' });
    setIcon(searchIcon, 'search');
    const searchInput = searchWrap.createEl('input', {
      type: 'text',
      cls: 'para-search',
      placeholder: this.plugin.t('search_results') + '...',
    });
    searchInput.value = this.plugin.state.searchQuery || '';
    searchInput.addEventListener('input', () => {
      this.plugin.state.searchQuery = searchInput.value;
    });
    searchInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.plugin.state.screen = 'search';
        await this.render();
      }
    });
    const clear = this.iconButton(searchWrap, 'x', 'Clear');
    clear.addEventListener('click', async () => {
      this.plugin.state.searchQuery = '';
      searchInput.value = '';
      if (this.plugin.state.screen === 'search') this.plugin.state.screen = 'home';
      await this.render();
    });
  }

  renderNav(root) {
    const nav = root.createDiv({ cls: 'para-nav' });
    const items = [
      { id: 'home', labelKey: 'nav_home', icon: 'home' },
      { id: 'today', labelKey: 'nav_today', icon: 'sun' },
      { id: 'inbox', labelKey: 'nav_inbox', icon: 'inbox' },
      { id: 'tasks', labelKey: 'nav_tasks', icon: 'check-square' },
      { id: 'projects', labelKey: 'nav_projects', icon: 'folder' },
      { id: 'areas', labelKey: 'nav_areas', icon: 'layers' },
      { id: 'resources', labelKey: 'nav_resources', icon: 'book' },
      { id: 'archives', labelKey: 'nav_archives', icon: 'archive' },
      { id: 'review', labelKey: 'nav_review', icon: 'refresh-cw' },
      { id: 'settings', labelKey: 'nav_settings', icon: 'settings' },
    ];
    for (const item of items) {
      const btn = nav.createEl('button', { cls: 'para-nav-btn' });
      if (this.plugin.state.screen === item.id) btn.addClass('is-active');
      const ic = btn.createSpan({ cls: 'para-nav-icon' });
      setIcon(ic, item.icon);
      btn.createSpan({ text: this.plugin.t(item.labelKey), cls: 'para-nav-label' });
      btn.addEventListener('click', async () => {
        this.plugin.state.screen = item.id;
        this.plugin.state.params = {};
        await this.render();
      });
    }
  }

  go(screen, extra) {
    this.plugin.state.screen = screen;
    this.plugin.state.params = extra || {};
    if (extra && extra.taskFilter) this.plugin.state.taskFilter = extra.taskFilter;
    this.render();
  }

  /* ---------- HOME ---------- */

  async renderHome(body) {
    const hero = body.createDiv({ cls: 'para-hero' });
    hero.createEl('h2', { text: this.plugin.t('hero_title'), cls: 'para-hero-title' });
    hero.createEl('p', { text: this.plugin.t('hero_sub'), cls: 'para-hero-sub' });

    const tasks = await this.plugin.getNotes('tasks');
    const projects = await this.plugin.getNotes('projects');
    const inbox = await this.plugin.getNotes('inbox');
    const today = todayISO();

    const openTasks = tasks.filter(t => t.fm.status !== 'completed' && !t.fm.archived);
    const dueToday = openTasks.filter(t => t.fm.due === today);
    const overdue = openTasks.filter(t => t.fm.due && t.fm.due < today);
    const upcoming = openTasks.filter(t => t.fm.due && t.fm.due > today && t.fm.due <= addDaysISO(7));
    const activeProjects = projects.filter(p => p.fm.status === 'active' && !p.fm.archived);
    const attention = activeProjects.filter(p => {
      if (p.fm.status === 'blocked') return true;
      if (p.fm.deadline && p.fm.deadline < today) return true;
      if (p.fm.deadline && p.fm.deadline <= addDaysISO(3)) return true;
      return false;
    });
    const activeInbox = inbox.filter(i => !i.fm.archived);

    const metricsBar = body.createDiv({ cls: 'para-metrics-bar' });
    this.renderStat(metricsBar, 'sun', dueToday.length, this.plugin.t('stat_due'), () => this.go('today'));
    this.renderStat(metricsBar, 'alert-circle', overdue.length, this.plugin.t('stat_over'), () => {
      this.plugin.state.taskFilter = 'overdue';
      this.go('tasks');
    });
    this.renderStat(metricsBar, 'folder', activeProjects.length, this.plugin.t('stat_active'), () => this.go('projects'));
    this.renderStat(metricsBar, 'inbox', activeInbox.length, this.plugin.t('stat_inbox'), () => this.go('inbox'));

    const actions = body.createDiv({ cls: 'para-toolbar' });
    const mkAction = (icon, labelKey, fn, primary = false) => {
      const b = actions.createEl('button', { cls: 'para-toolbar-btn' + (primary ? ' is-primary' : '') });
      const ic = b.createSpan({ cls: 'para-btn-icon' });
      setIcon(ic, icon);
      b.createSpan({ text: this.plugin.t(labelKey) });
      b.addEventListener('click', fn);
    };
    mkAction('plus', 'act_add_task', () => new TaskModal(this.app, this.plugin).open(), true);
    mkAction('zap', 'act_capture', () => new QuickCaptureModal(this.app, this.plugin).open());
    mkAction('target', 'act_new_proj', () => new ProjectModal(this.app, this.plugin).open());
    mkAction('refresh-cw', 'act_review', () => this.go('review'));

    const panels = body.createDiv({ cls: 'para-dashboard-grid' });
    this.renderTaskPanel(panels, 'sun', 'panel_due', dueToday, 'panel_due_empty', () => new TaskModal(this.app, this.plugin).open());
    this.renderTaskPanel(panels, 'alert-circle', 'panel_over', overdue, 'panel_over_empty', () => new TaskModal(this.app, this.plugin).open());
    this.renderTaskPanel(panels, 'calendar', 'panel_up', upcoming, 'panel_up_empty', () => new TaskModal(this.app, this.plugin).open());
    this.renderProjectPanel(panels, 'folder', 'panel_active', activeProjects, 'panel_active_empty', () => new ProjectModal(this.app, this.plugin).open());
    this.renderProjectPanel(panels, 'alert-triangle', 'panel_att', attention, 'panel_att_empty', null);

    const recent = body.createDiv({ cls: 'para-panel para-recent' });
    this.panelHeader(recent, 'clock', this.plugin.t('panel_recent'));
    const all = []
      .concat(tasks.map(t => ({ ...t, kind: this.plugin.t('nav_tasks').slice(0, -1) })))
      .concat(projects.map(t => ({ ...t, kind: this.plugin.t('nav_projects').slice(0, -1) })))
      .concat(inbox.map(t => ({ ...t, kind: this.plugin.t('nav_inbox').slice(0, -1) })));
    all.sort((a, b) => String(b.fm.created || '').localeCompare(String(a.fm.created || '')));
    if (all.length === 0) {
      this.renderEmpty(recent, 'sparkles', this.plugin.t('panel_recent_empty'));
    } else {
      for (const n of all.slice(0, 8)) {
        const row = recent.createDiv({ cls: 'para-mini-row' });
        row.createEl('strong', { text: n.kind + ': ' });
        row.createEl('span', { text: n.fm.title || n.file.basename });
      }
    }

    const summary = body.createDiv({ cls: 'para-summary' });
    summary.createEl('h3', { text: this.plugin.t('panel_summary') });
    const completed = tasks.filter(t => t.fm.status === 'completed').length;
    summary.createEl('p', { text: this.plugin.t('sum_tasks') + ` ${completed} / ${tasks.length}.` });
    summary.createEl('p', { text: this.plugin.t('sum_proj') + ` ${activeProjects.length}.` });
    summary.createEl('p', { text: this.plugin.t('sum_inbox') + ` ${activeInbox.length}.` });
  }

  renderTaskPanel(parent, icon, titleKey, tasks, emptyKey, addFn) {
    const panel = parent.createDiv({ cls: 'para-panel' });
    this.panelHeader(panel, icon, this.plugin.t(titleKey));
    if (!tasks || tasks.length === 0) {
      this.renderEmpty(panel, 'check-circle', this.plugin.t(emptyKey), addFn ? this.plugin.t('act_add_task') : null, addFn);
      return;
    }
    for (const t of tasks.slice(0, 6)) {
      const row = panel.createDiv({ cls: 'para-mini-row' });
      row.createEl('span', { text: t.fm.title || t.file.basename });
      if (t.fm.due) row.createEl('span', { cls: 'para-muted', text: t.fm.due });
    }
  }

  renderProjectPanel(parent, icon, titleKey, projects, emptyKey, addFn) {
    const panel = parent.createDiv({ cls: 'para-panel' });
    this.panelHeader(panel, icon, this.plugin.t(titleKey));
    if (!projects || projects.length === 0) {
      this.renderEmpty(panel, 'check-circle', this.plugin.t(emptyKey), addFn ? this.plugin.t('act_new_proj') : null, addFn);
      return;
    }
    for (const p of projects.slice(0, 6)) {
      const row = panel.createDiv({ cls: 'para-mini-row' });
      row.createEl('span', { text: p.fm.title || p.file.basename });
      if (p.fm.deadline) row.createEl('span', { cls: 'para-muted', text: p.fm.deadline });
    }
  }

  /* ---------- TASKS ---------- */

  async renderTasks(body, forcedFilter) {
    const filter = forcedFilter || 'today';
    body.createEl('h2', { text: this.plugin.t('nav_tasks') });

    const tabs = body.createDiv({ cls: 'para-tabs' });
    const filters = [
      ['today', 'tab_today'], ['overdue', 'tab_over'], ['upcoming', 'tab_up'],
      ['high', 'tab_high'], ['open', 'tab_open'], ['completed', 'tab_comp'],
      ['byproject', 'tab_proj'],
    ];
    for (const f of filters) {
      const id = f[0], label = this.plugin.t(f[1]);
      const tab = tabs.createEl('button', { text: label, cls: 'para-tab' });
      if (id === filter) tab.addClass('is-active');
      tab.addEventListener('click', () => {
        this.plugin.state.screen = 'tasks';
        this.plugin.state.taskFilter = id;
        this.render();
      });
    }

    const row = body.createDiv({ cls: 'para-row' });
    const addBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const addIc = addBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(addIc, 'plus');
    addBtn.createSpan({ text: this.plugin.t('btn_add_task') });
    addBtn.addEventListener('click', () => new TaskModal(this.app, this.plugin).open());

    let tasks = (await this.plugin.getNotes('tasks')).filter(t => !t.fm.archived);
    const today = todayISO();

    if (filter === 'today') tasks = tasks.filter(t => t.fm.status !== 'completed' && t.fm.due === today);
    else if (filter === 'overdue') tasks = tasks.filter(t => t.fm.status !== 'completed' && t.fm.due && t.fm.due < today);
    else if (filter === 'upcoming') tasks = tasks.filter(t => t.fm.status !== 'completed' && t.fm.due && t.fm.due > today && t.fm.due <= addDaysISO(14));
    else if (filter === 'high') tasks = tasks.filter(t => t.fm.status !== 'completed' && String(t.fm.priority || '').toLowerCase() === 'high');
    else if (filter === 'open') tasks = tasks.filter(t => t.fm.status !== 'completed');
    else if (filter === 'completed') tasks = tasks.filter(t => t.fm.status === 'completed');

    tasks.sort((a, b) => String(a.fm.due || '9999-12-31').localeCompare(String(b.fm.due || '9999-12-31')));

    if (filter === 'byproject') {
      const groups = {};
      for (const t of tasks) {
        const key = t.fm.project || '(no project)';
        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
      }
      if (Object.keys(groups).length === 0) {
        this.renderEmpty(body, 'inbox', this.plugin.t('empty_tasks'));
      } else {
        for (const key of Object.keys(groups)) {
          body.createEl('h3', { text: key });
          const list = body.createDiv({ cls: 'para-list' });
          for (const t of groups[key].slice(0, MAX_RENDER)) this.renderTaskRow(list, t);
          if (groups[key].length > MAX_RENDER) {
            body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
          }
        }
      }
      return;
    }

    if (tasks.length === 0) {
      this.renderEmpty(body, 'check-circle', this.plugin.t('task_no_tasks'));
      return;
    }

    const list = body.createDiv({ cls: 'para-list' });
    const displayedTasks = tasks.slice(0, MAX_RENDER);
    for (const t of displayedTasks) this.renderTaskRow(list, t);
    
    if (tasks.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  async renderTaskRow(parent, note) {
    const priority = String(note.fm.priority || 'medium').toLowerCase();
    const isCompleted = note.fm.status === 'completed';
    const row = parent.createDiv({ cls: 'para-task-row para-priority-' + priority + (isCompleted ? ' is-completed' : '') });

    const checkWrap = row.createDiv({ cls: 'para-check-wrap' });
    const check = checkWrap.createEl('input', { type: 'checkbox', cls: 'para-check' });
    check.checked = isCompleted;
    check.setAttribute('aria-label', isCompleted ? this.plugin.t('task_mark_inc') : this.plugin.t('task_mark_comp'));
    check.addEventListener('change', async () => {
      const fm = Object.assign({}, note.fm);
      fm.status = check.checked ? 'completed' : 'open';
      try {
        await this.plugin.updateNote(note.file, fm, note.body);
        this.plugin.refreshAll();
      } catch (e) {
        new Notice(this.plugin.t('err_update'));
      }
    });

    const main = row.createDiv({ cls: 'para-task-main' });
    main.createEl('div', { cls: 'para-task-title', text: note.fm.title || note.file.basename });
    const meta = main.createDiv({ cls: 'para-task-meta' });

    if (note.fm.due) {
      const pill = meta.createSpan({ cls: 'para-pill para-pill-date' });
      const pic = pill.createSpan({ cls: 'para-pill-icon' });
      setIcon(pic, 'calendar');
      pill.createSpan({ text: note.fm.due });
    }
    if (note.fm.priority) {
      const pill = meta.createSpan({ cls: 'para-pill' });
      const pic = pill.createSpan({ cls: 'para-pill-icon' });
      setIcon(pic, 'flag');
      pill.createSpan({ text: note.fm.priority });
    }
    
    if (note.fm.project) {
      const exists = await this.plugin.noteExists(note.fm.project, 'projects');
      const pill = meta.createSpan({ cls: 'para-pill' + (exists ? '' : ' para-pill-warn') });
      const pic = pill.createSpan({ cls: 'para-pill-icon' });
      setIcon(pic, exists ? 'folder' : 'alert-circle');
      pill.createSpan({ text: exists ? note.fm.project : this.plugin.t('task_missing') + ' ' + note.fm.project });
    }

    const actions = row.createDiv({ cls: 'para-task-actions' });
    const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
    moreBtn.addEventListener('click', (evt) => {
      const menu = new Menu();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new TaskModal(this.app, this.plugin, note).open()));
      menu.addSeparator();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
        const fm = Object.assign({}, note.fm); fm.archived = true;
        try { await this.plugin.updateNote(note.file, fm, note.body); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_arch')); }
      }));
      menu.showAtMouseEvent(evt);
    });
  }

  /* ---------- INBOX ---------- */

  async renderInbox(body) {
    body.createEl('h2', { text: this.plugin.t('nav_inbox') });
    const row = body.createDiv({ cls: 'para-row' });
    const addBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const addIc = addBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(addIc, 'plus');
    addBtn.createSpan({ text: this.plugin.t('btn_capture') });
    addBtn.addEventListener('click', () => new QuickCaptureModal(this.app, this.plugin).open());

    const items = (await this.plugin.getNotes('inbox')).filter(i => !i.fm.archived);
    if (items.length === 0) {
      this.renderEmpty(body, 'inbox', this.plugin.t('empty_inbox'), this.plugin.t('btn_capture'), () => new QuickCaptureModal(this.app, this.plugin).open());
      return;
    }
    const list = body.createDiv({ cls: 'para-list' });
    const displayed = items.slice(0, MAX_RENDER);
    for (const item of displayed) {
      const card = list.createDiv({ cls: 'para-card' });
      card.createEl('h3', { text: item.fm.title || item.file.basename });
      if (item.fm.category) card.createEl('p', { cls: 'para-muted', text: this.plugin.t('inbox_cat') + ' ' + item.fm.category });
      if (item.body) card.createEl('p', { cls: 'para-muted', text: item.body.slice(0, 200) });
      
      const actions = card.createDiv({ cls: 'para-row' });
      const assignBtn = actions.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const aIc = assignBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(aIc, 'link');
      assignBtn.createSpan({ text: this.plugin.t('btn_assign') });
      assignBtn.addEventListener('click', () => new AssignModal(this.app, this.plugin, item).open());
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((itemMenu) => itemMenu.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
          const fm = Object.assign({}, item.fm); fm.archived = true;
          try { await this.plugin.updateNote(item.file, fm, item.body); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.showAtMouseEvent(evt);
      });
    }
    if (items.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  /* ---------- PROJECTS ---------- */

  async renderProjects(body) {
    body.createEl('h2', { text: this.plugin.t('nav_projects') });
    const row = body.createDiv({ cls: 'para-row' });
    const addBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const addIc = addBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(addIc, 'plus');
    addBtn.createSpan({ text: this.plugin.t('btn_new_proj') });
    addBtn.addEventListener('click', () => new ProjectModal(this.app, this.plugin).open());

    const projects = (await this.plugin.getNotes('projects')).filter(p => !p.fm.archived);
    if (projects.length === 0) {
      this.renderEmpty(body, 'folder', this.plugin.t('empty_proj'), this.plugin.t('btn_new_proj'), () => new ProjectModal(this.app, this.plugin).open());
      return;
    }

    const list = body.createDiv({ cls: 'para-list' });
    const displayed = projects.slice(0, MAX_RENDER);
    for (const p of displayed) {
      const tasks = await this.plugin.getTasksForProject(p.fm.title || p.file.basename);
      const total = tasks.length;
      const done = tasks.filter(t => t.fm.status === 'completed').length;

      const card = list.createDiv({ cls: 'para-card para-project-card' });
      const head = card.createDiv({ cls: 'para-card-head' });
      head.createEl('h3', { text: p.fm.title || p.file.basename });

      const today = todayISO();
      if (p.fm.status === 'blocked') head.createEl('span', { cls: 'para-pill para-pill-warn', text: this.plugin.t('proj_blocked') });
      if (p.fm.deadline && p.fm.deadline < today) head.createEl('span', { cls: 'para-pill para-pill-warn', text: this.plugin.t('proj_over') });
      else if (p.fm.deadline && p.fm.deadline <= addDaysISO(3)) head.createEl('span', { cls: 'para-pill para-pill-warn', text: this.plugin.t('proj_soon') });
      if (p.fm.status === 'inactive') head.createEl('span', { cls: 'para-pill', text: this.plugin.t('proj_inactive') });

      if (p.fm.outcome) card.createEl('p', { cls: 'para-muted', text: this.plugin.t('proj_outcome') + ' ' + p.fm.outcome });
      if (p.fm.description) card.createEl('p', { cls: 'para-muted', text: p.fm.description });

      if (total === 0) {
        card.createEl('p', { cls: 'para-muted', text: this.plugin.t('proj_no_prog') });
      } else {
        const bar = card.createDiv({ cls: 'para-progress' });
        const fill = bar.createDiv({ cls: 'para-progress-fill' });
        fill.style.width = Math.round((done / total) * 100) + '%';
        card.createEl('p', { cls: 'para-muted', text: `${done} / ${total} ${this.plugin.t('proj_tasks_done')}` });
      }

      const actions = card.createDiv({ cls: 'para-row' });
      const openBtn = actions.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const oIc = openBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(oIc, 'arrow-right');
      openBtn.createSpan({ text: this.plugin.t('btn_open') });
      openBtn.addEventListener('click', () => this.go('project', { projectId: p.fm['para-id'] }));
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new ProjectModal(this.app, this.plugin, p).open()));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
          const fm = Object.assign({}, p.fm); fm.archived = true;
          try { await this.plugin.updateNote(p.file, fm, p.body); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.showAtMouseEvent(evt);
      });
    }
    if (projects.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  async renderProjectDetail(body) {
    const id = this.plugin.state.params.projectId;
    const projects = await this.plugin.getNotes('projects');
    const project = projects.find(p => p.fm['para-id'] === id);
    if (!project) {
      this.renderEmpty(body, 'alert-circle', 'Project not found.');
      const back = body.createEl('button', { cls: 'para-btn' });
      const bIc = back.createSpan({ cls: 'para-btn-icon' });
      setIcon(bIc, 'arrow-left');
      back.createSpan({ text: this.plugin.t('btn_back') });
      back.addEventListener('click', () => this.go('projects'));
      return;
    }

    const headerRow = body.createDiv({ cls: 'para-row', attr: { style: 'justify-content: space-between; margin-bottom: 8px;' } });
    
    const back = headerRow.createEl('button', { cls: 'para-btn para-btn-small' });
    const bIc = back.createSpan({ cls: 'para-btn-icon' });
    setIcon(bIc, 'arrow-left');
    back.createSpan({ text: this.plugin.t('btn_back') });
    back.addEventListener('click', () => this.go('projects'));

    const moreBtn = headerRow.createEl('button', { cls: 'para-btn para-btn-small' });
    const mIc = moreBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(mIc, 'more-horizontal');
    moreBtn.createSpan({ text: this.plugin.t('btn_actions') });
    moreBtn.addEventListener('click', (evt) => {
      const menu = new Menu();
      menu.addItem((item) => item.setTitle(this.plugin.t('proj_edit')).setIcon('pencil').onClick(() => new ProjectModal(this.app, this.plugin, project).open()));
      menu.addItem((item) => item.setTitle(this.plugin.t('proj_comp')).setIcon('check-circle').onClick(async () => {
        const fm = Object.assign({}, project.fm); fm.status = 'completed';
        try { await this.plugin.updateNote(project.file, fm, project.body); new Notice(this.plugin.t('msg_proj_comp')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_update')); }
      }));
      menu.addSeparator();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
        const fm = Object.assign({}, project.fm); fm.archived = true;
        try { await this.plugin.updateNote(project.file, fm, project.body); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_arch')); }
      }));
      menu.showAtMouseEvent(evt);
    });

    body.createEl('h2', { text: project.fm.title || project.file.basename });
    const info = body.createDiv({ cls: 'para-panel' });
    if (project.fm.outcome) info.createEl('p', { text: this.plugin.t('proj_outcome') + ' ' + project.fm.outcome });
    if (project.fm.description) info.createEl('p', { text: this.plugin.t('proj_desc') + ' ' + project.fm.description });
    if (project.fm.status) info.createEl('p', { text: this.plugin.t('proj_status') + ' ' + project.fm.status });
    if (project.fm.priority) info.createEl('p', { text: this.plugin.t('proj_prio') + ' ' + project.fm.priority });
    if (project.fm.deadline) info.createEl('p', { text: this.plugin.t('proj_deadline') + ' ' + project.fm.deadline });
    if (project.fm.area) {
      const exists = await this.plugin.noteExists(project.fm.area, 'areas');
      info.createEl('p', { text: exists ? (this.plugin.t('proj_area') + ' ' + project.fm.area) : (this.plugin.t('proj_area_missing') + ' ' + project.fm.area) });
    }

    const tasks = await this.plugin.getTasksForProject(project.fm.title || project.file.basename);
    const total = tasks.length;
    const done = tasks.filter(t => t.fm.status === 'completed').length;
    const progress = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(progress, 'activity', this.plugin.t('proj_progress'));
    if (total === 0) {
      progress.createEl('p', { cls: 'para-muted', text: this.plugin.t('proj_no_prog') });
    } else {
      const bar = progress.createDiv({ cls: 'para-progress' });
      const fill = bar.createDiv({ cls: 'para-progress-fill' });
      fill.style.width = Math.round((done / total) * 100) + '%';
      progress.createEl('p', { cls: 'para-muted', text: `${done} / ${total} ${this.plugin.t('proj_tasks_done')}` });
    }

    const listSection = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(listSection, 'check-square', this.plugin.t('nav_tasks'));
    const inlineRow = listSection.createDiv({ cls: 'para-inline-add' });
    const inlineInput = inlineRow.createEl('input', { type: 'text', cls: 'para-input', placeholder: this.plugin.t('proj_add_task_ph') });
    const inlineBtn = inlineRow.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
    const iIc = inlineBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(iIc, 'plus');
    inlineBtn.createSpan({ text: this.plugin.t('proj_add') });
    const addFn = async () => {
      const val = inlineInput.value.trim();
      if (!val) return;
      const fm = {
        'para-type': 'task', 'para-id': makeId(), 'title': val,
        'description': '', 'due': '', 'priority': 'medium', 'status': 'open',
        'project': project.fm.title || project.file.basename,
        'area': project.fm.area || '',
        'created': nowISO(), 'archived': false,
      };
      try {
        await this.plugin.createNote('tasks', val, fm, '');
        new Notice(this.plugin.t('msg_saved'));
        this.render();
      } catch (e) { new Notice(this.plugin.t('err_save')); }
    };
    inlineBtn.addEventListener('click', addFn);
    inlineInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addFn(); });

    if (tasks.length === 0) {
      this.renderEmpty(listSection, 'check-circle', this.plugin.t('proj_no_tasks'));
    } else {
      const list = listSection.createDiv({ cls: 'para-list' });
      const displayed = tasks.slice(0, MAX_RENDER);
      for (const t of displayed) this.renderTaskRow(list, t);
      if (tasks.length > MAX_RENDER) {
        listSection.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
      }
    }

    const notesSection = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(notesSection, 'book', this.plugin.t('proj_res'));
    const resources = (await this.plugin.getNotes('resources')).filter(r => r.fm.project === (project.fm.title || project.file.basename));
    if (resources.length === 0) {
      this.renderEmpty(notesSection, 'book', this.plugin.t('proj_no_res'));
    } else {
      for (const r of resources) {
        const row = notesSection.createDiv({ cls: 'para-mini-row' });
        row.createEl('span', { text: r.fm.title || r.file.basename });
      }
    }
  }

  /* ---------- AREAS ---------- */

  async renderAreas(body) {
    body.createEl('h2', { text: this.plugin.t('nav_areas') });
    const row = body.createDiv({ cls: 'para-row' });
    const addBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const addIc = addBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(addIc, 'plus');
    addBtn.createSpan({ text: this.plugin.t('btn_new_area') });
    addBtn.addEventListener('click', () => new AreaModal(this.app, this.plugin).open());

    const areas = (await this.plugin.getNotes('areas')).filter(a => !a.fm.archived);
    if (areas.length === 0) {
      this.renderEmpty(body, 'layers', this.plugin.t('empty_area'), this.plugin.t('btn_new_area'), () => new AreaModal(this.app, this.plugin).open());
      return;
    }
    const list = body.createDiv({ cls: 'para-list' });
    const displayed = areas.slice(0, MAX_RENDER);
    for (const a of displayed) {
      const card = list.createDiv({ cls: 'para-card' });
      card.createEl('h3', { text: a.fm.title || a.file.basename });
      if (a.fm.description) card.createEl('p', { cls: 'para-muted', text: a.fm.description });
      
      const actions = card.createDiv({ cls: 'para-row' });
      const openBtn = actions.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const oIc = openBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(oIc, 'arrow-right');
      openBtn.createSpan({ text: this.plugin.t('btn_open') });
      openBtn.addEventListener('click', () => this.go('area', { areaId: a.fm['para-id'] }));
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new AreaModal(this.app, this.plugin, a).open()));
        menu.showAtMouseEvent(evt);
      });
    }
    if (areas.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  async renderAreaDetail(body) {
    const id = this.plugin.state.params.areaId;
    const areas = await this.plugin.getNotes('areas');
    const area = areas.find(a => a.fm['para-id'] === id);
    if (!area) {
      this.renderEmpty(body, 'alert-circle', 'Area not found.');
      return;
    }
    const back = body.createEl('button', { cls: 'para-btn para-btn-small' });
    const bIc = back.createSpan({ cls: 'para-btn-icon' });
    setIcon(bIc, 'arrow-left');
    back.createSpan({ text: this.plugin.t('btn_back') });
    back.addEventListener('click', () => this.go('areas'));

    body.createEl('h2', { text: area.fm.title || area.file.basename });
    if (area.fm.description) body.createEl('p', { cls: 'para-muted', text: area.fm.description });

    const name = area.fm.title || area.file.basename;
    const projects = (await this.plugin.getNotes('projects')).filter(p => p.fm.area === name && !p.fm.archived);
    const tasks = (await this.plugin.getNotes('tasks')).filter(t => t.fm.area === name && !t.fm.archived);
    const resources = (await this.plugin.getNotes('resources')).filter(r => r.fm.area === name && !r.fm.archived);

    const pPanel = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(pPanel, 'folder', this.plugin.t('area_proj'));
    if (projects.length === 0) this.renderEmpty(pPanel, 'folder', this.plugin.t('area_no_proj'));
    else for (const p of projects.slice(0, MAX_RENDER)) pPanel.createDiv({ cls: 'para-mini-row', text: p.fm.title || p.file.basename });

    const tPanel = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(tPanel, 'check-square', this.plugin.t('area_tasks'));
    if (tasks.length === 0) this.renderEmpty(tPanel, 'check-circle', this.plugin.t('area_no_tasks'));
    else { const l = tPanel.createDiv({ cls: 'para-list' }); for (const t of tasks.slice(0, MAX_RENDER)) this.renderTaskRow(l, t); }

    const rPanel = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(rPanel, 'book', this.plugin.t('area_res'));
    if (resources.length === 0) this.renderEmpty(rPanel, 'book', this.plugin.t('area_no_res'));
    else for (const r of resources.slice(0, MAX_RENDER)) rPanel.createDiv({ cls: 'para-mini-row', text: r.fm.title || r.file.basename });
  }

  /* ---------- RESOURCES ---------- */

  async renderResources(body) {
    body.createEl('h2', { text: this.plugin.t('nav_resources') });
    const row = body.createDiv({ cls: 'para-row' });
    const addBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const addIc = addBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(addIc, 'plus');
    addBtn.createSpan({ text: this.plugin.t('btn_new_res') });
    addBtn.addEventListener('click', () => new ResourceModal(this.app, this.plugin).open());

    const query = (this.plugin.state.searchQuery || '').toLowerCase();
    let resources = (await this.plugin.getNotes('resources')).filter(r => !r.fm.archived);
    if (query) {
      resources = resources.filter(r =>
        String(r.fm.title || '').toLowerCase().includes(query) ||
        String(r.fm.category || '').toLowerCase().includes(query) ||
        String(r.body || '').toLowerCase().includes(query)
      );
    }

    if (resources.length === 0) {
      this.renderEmpty(body, 'book', this.plugin.t('empty_res'), this.plugin.t('btn_new_res'), () => new ResourceModal(this.app, this.plugin).open());
      return;
    }
    const list = body.createDiv({ cls: 'para-list' });
    const displayed = resources.slice(0, MAX_RENDER);
    for (const r of displayed) {
      const card = list.createDiv({ cls: 'para-card' });
      card.createEl('h3', { text: r.fm.title || r.file.basename });
      if (r.fm.category) card.createEl('p', { cls: 'para-muted', text: this.plugin.t('res_cat') + ' ' + r.fm.category });
      if (r.fm.description) card.createEl('p', { cls: 'para-muted', text: r.fm.description });
      if (r.fm.url) card.createEl('p', { cls: 'para-muted', text: this.plugin.t('res_link') + ' ' + r.fm.url });
      
      const actions = card.createDiv({ cls: 'para-row' });
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new ResourceModal(this.app, this.plugin, r).open()));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
          const fm = Object.assign({}, r.fm); fm.archived = true;
          try { await this.plugin.updateNote(r.file, fm, r.body); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.showAtMouseEvent(evt);
      });
    }
    if (resources.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  /* ---------- ARCHIVES ---------- */

  async renderArchives(body) {
    body.createEl('h2', { text: this.plugin.t('nav_archives') });
    body.createEl('p', { cls: 'para-muted', text: this.plugin.t('arch_desc') });

    const folders = ['inbox', 'tasks', 'projects', 'areas', 'resources'];
    const archived = [];
    for (const f of folders) {
      const notes = await this.plugin.getNotes(f);
      for (const n of notes) {
        if (n.fm.archived === true || n.fm.archived === 'true') archived.push(Object.assign({}, n, { folderKey: f }));
      }
    }
    if (archived.length === 0) {
      this.renderEmpty(body, 'archive', this.plugin.t('empty_arch'));
      return;
    }
    const list = body.createDiv({ cls: 'para-list' });
    const displayed = archived.slice(0, MAX_RENDER);
    for (const n of displayed) {
      const card = list.createDiv({ cls: 'para-card' });
      card.createEl('h3', { text: n.fm.title || n.file.basename });
      card.createEl('p', { cls: 'para-muted', text: this.plugin.t('arch_type') + ' ' + (n.fm['para-type'] || n.folderKey) });
      const actions = card.createDiv({ cls: 'para-row' });
      const restoreBtn = actions.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const rIc = restoreBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(rIc, 'rotate-ccw');
      restoreBtn.createSpan({ text: this.plugin.t('btn_restore') });
      restoreBtn.addEventListener('click', async () => {
        const fm = Object.assign({}, n.fm); fm.archived = false;
        try { await this.plugin.updateNote(n.file, fm, n.body); new Notice(this.plugin.t('msg_restored')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_restore')); }
      });
    }
    if (archived.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  /* ---------- WEEKLY REVIEW ---------- */

  async renderReview(body) {
    body.createEl('h2', { text: this.plugin.t('nav_review') });
    body.createEl('p', { cls: 'para-muted', text: this.plugin.t('rev_desc') });
    
    const progress = this.plugin.data.reviewProgress || {};
    const total = REVIEW_STEPS.length;
    const done = REVIEW_STEPS.filter(s => progress[s.key]).length;

    const bar = body.createDiv({ cls: 'para-progress' });
    const fill = bar.createDiv({ cls: 'para-progress-fill' });
    fill.style.width = Math.round((done / total) * 100) + '%';
    body.createEl('p', { cls: 'para-muted', text: `${done} / ${total}` });

    const resetBtn = body.createEl('button', { cls: 'para-btn para-btn-small' });
    const resetIc = resetBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(resetIc, 'rotate-ccw');
    resetBtn.createSpan({ text: this.plugin.t('btn_reset') });
    resetBtn.addEventListener('click', async () => {
      this.plugin.data.reviewProgress = {};
      await this.plugin.saveData(this.plugin.data);
      this.render();
    });

    const list = body.createDiv({ cls: 'para-list' });
    for (const step of REVIEW_STEPS) {
      const row = list.createDiv({ cls: 'para-card para-review-row' });
      const check = row.createEl('input', { type: 'checkbox', cls: 'para-check' });
      check.checked = !!progress[step.key];
      check.addEventListener('change', async () => {
        this.plugin.data.reviewProgress[step.key] = check.checked;
        await this.plugin.saveData(this.plugin.data);
        this.render();
      });
      const info = row.createDiv({ cls: 'para-review-info' });
      info.createEl('strong', { text: this.plugin.t(step.titleKey) });
      info.createEl('p', { cls: 'para-muted', text: this.plugin.t(step.hintKey) });
      const goBtn = row.createEl('button', { cls: 'para-btn para-btn-small' });
      const gIc = goBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(gIc, 'arrow-right');
      goBtn.createSpan({ text: this.plugin.t('btn_go') });
      goBtn.addEventListener('click', () => {
        if (step.screen === 'tasks' && step.taskFilter) this.plugin.state.taskFilter = step.taskFilter;
        this.go(step.screen);
      });
    }
  }

  /* ---------- SEARCH ---------- */

  async renderSearch(body) {
    const q = (this.plugin.state.searchQuery || '').toLowerCase().trim();
    body.createEl('h2', { text: this.plugin.t('search_results') });
    if (!q) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('search_empty') });
      return;
    }
    const results = await this.plugin.searchAll(q);
    if (results.length === 0) {
      this.renderEmpty(body, 'search', this.plugin.t('search_none') + ' "' + q + '".');
      return;
    }
    const list = body.createDiv({ cls: 'para-list' });
    const displayed = results.slice(0, MAX_RENDER);
    for (const r of displayed) {
      const row = list.createDiv({ cls: 'para-card para-search-result' });
      const head = row.createDiv({ cls: 'para-card-head' });
      head.createEl('h3', { text: r.fm.title || r.file.basename });
      head.createEl('span', { cls: 'para-pill', text: r.type });
      const openBtn = row.createEl('button', { cls: 'para-btn para-btn-small' });
      const oIc = openBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(oIc, 'file-text');
      openBtn.createSpan({ text: this.plugin.t('search_open') });
      openBtn.addEventListener('click', async () => {
        const leaf = this.app.workspace.getLeaf('tab');
        await leaf.openFile(r.file);
      });
    }
    if (results.length > MAX_RENDER) {
      body.createEl('p', { cls: 'para-muted', text: this.plugin.t('task_showing') });
    }
  }

  /* ---------- SETTINGS & HELP ---------- */

  async renderSettings(body) {
    body.createEl('h2', { text: this.plugin.t('nav_settings') });

    const langPanel = body.createDiv({ cls: 'para-panel' });
    new Setting(langPanel)
      .setName(this.plugin.t('set_lang'))
      .setDesc(this.plugin.t('set_lang_desc'))
      .addDropdown(drop => drop
        .addOption('en', 'English')
        .addOption('de', 'Deutsch')
        .setValue(this.plugin.data.language || 'en')
        .onChange(async (val) => {
          this.plugin.data.language = val;
          await this.plugin.saveData(this.plugin.data);
          this.render(); // instantly re-render the panel
        })
      );

    const help = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(help, 'lightbulb', this.plugin.t('set_para'));
    help.createEl('p', { text: this.plugin.t('set_para_desc') });

    help.createEl('h3', { text: this.plugin.t('set_actions') });
    help.createEl('p', { text: this.plugin.t('set_a1') });
    help.createEl('p', { text: this.plugin.t('set_a2') });
    help.createEl('p', { text: this.plugin.t('set_a3') });
    help.createEl('p', { text: this.plugin.t('set_a4') });
    help.createEl('p', { text: this.plugin.t('set_a5') });

    const tools = body.createDiv({ cls: 'para-panel' });
    this.panelHeader(tools, 'settings', this.plugin.t('set_tools'));
    const row = tools.createDiv({ cls: 'para-row' });
    const backupBtn = row.createEl('button', { cls: 'para-btn para-btn-primary' });
    const bIc = backupBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(bIc, 'download');
    backupBtn.createSpan({ text: this.plugin.t('set_backup') });
    backupBtn.addEventListener('click', async () => {
      try { await this.plugin.exportBackup(); }
      catch (e) { new Notice(this.plugin.t('err_backup')); }
    });

    const resetBtn = row.createEl('button', { cls: 'para-btn' });
    const rIc = resetBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(rIc, 'rotate-ccw');
    resetBtn.createSpan({ text: this.plugin.t('set_reset') });
    resetBtn.addEventListener('click', async () => {
      this.plugin.data.onboardingDone = false;
      await this.plugin.saveData(this.plugin.data);
      new Notice(this.plugin.t('set_show_again'));
    });

    if (this.plugin.data.sampleCreated) {
      const removeSampleBtn = row.createEl('button', { cls: 'para-btn' });
      const sIc = removeSampleBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(sIc, 'trash-2');
      removeSampleBtn.createSpan({ text: this.plugin.t('set_remove') });
      removeSampleBtn.addEventListener('click', async () => {
        await this.plugin.removeSampleContent();
      });
    }
  }

  /* ---------- ONBOARDING ---------- */

  renderOnboarding(root) {
    const overlay = root.createDiv({ cls: 'para-onboarding-overlay' });
    const card = overlay.createDiv({ cls: 'para-onboarding-card' });
    card.createEl('h1', { text: this.plugin.t('onb_title') });
    card.createEl('p', { text: this.plugin.t('onb_sub') });

    const list = card.createDiv({ cls: 'para-onboarding-list' });
    const concepts = [
      ['folder', 'onb_p', 'onb_pd'],
      ['layers', 'onb_a', 'onb_ad'],
      ['book', 'onb_r', 'onb_rd'],
      ['archive', 'onb_ar', 'onb_ard'],
      ['inbox', 'onb_i', 'onb_id'],
    ];
    for (const c of concepts) {
      const icon = c[0], k = c[1], v = c[2];
      const row = list.createDiv({ cls: 'para-onboarding-row' });
      const icWrap = row.createDiv({ cls: 'para-onboarding-icon' });
      setIcon(icWrap, icon);
      const text = row.createDiv({ cls: 'para-onboarding-text' });
      text.createEl('strong', { text: this.plugin.t(k) });
      text.createEl('span', { text: this.plugin.t(v) });
    }

    const actions = card.createDiv({ cls: 'para-onboarding-actions' });
    const tBtn = actions.createEl('button', { cls: 'para-btn para-btn-primary' });
    const tIc = tBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(tIc, 'plus');
    tBtn.createSpan({ text: this.plugin.t('onb_t_btn') });
    tBtn.addEventListener('click', async () => {
      this.plugin.data.onboardingDone = true;
      await this.plugin.saveData(this.plugin.data);
      new TaskModal(this.app, this.plugin).open();
      this.render();
    });

    const pBtn = actions.createEl('button', { cls: 'para-btn' });
    const pIc = pBtn.createSpan({ cls: 'para-btn-icon' });
    setIcon(pIc, 'target');
    pBtn.createSpan({ text: this.plugin.t('onb_p_btn') });
    pBtn.addEventListener('click', async () => {
      this.plugin.data.onboardingDone = true;
      await this.plugin.saveData(this.plugin.data);
      new ProjectModal(this.app, this.plugin).open();
      this.render();
    });

    const sBtn = actions.createEl('button', { cls: 'para-btn' });
    sBtn.createSpan({ text: this.plugin.t('onb_skip') });
    sBtn.addEventListener('click', async () => {
      this.plugin.data.onboardingDone = true;
      await this.plugin.saveData(this.plugin.data);
      this.render();
    });

    const sample = card.createDiv({ cls: 'para-onboarding-sample' });
    sample.createEl('p', { text: this.plugin.t('onb_sample') });
    const addSample = sample.createEl('button', { cls: 'para-btn para-btn-small' });
    const sIc = addSample.createSpan({ cls: 'para-btn-icon' });
    setIcon(sIc, 'sparkles');
    addSample.createSpan({ text: this.plugin.t('onb_add_sample') });
    addSample.addEventListener('click', async () => {
      await this.plugin.createSampleContent();
      this.render();
    });
  }
}

/* ============================================================
   PLUGIN
   ============================================================ */

class ParaHubPlugin extends Plugin {
  async onload() {
    await this.loadPluginData();
    await this.ensureFolders();
    
    this.cache = {};
    await this.buildCache();

    this.state = {
      screen: 'home',
      params: {},
      searchQuery: '',
      taskFilter: 'today',
    };

    this.registerView(VIEW_TYPE, (leaf) => new ParaHubView(leaf, this));
    this.addRibbonIcon('layout-dashboard', 'Open PARA Hub', () => this.activateView());

    this.addCommand({ id: 'open-para-hub', name: 'Open PARA Hub', callback: () => this.activateView() });
    this.addCommand({ id: 'quick-capture', name: 'Quick Capture', callback: () => new QuickCaptureModal(this.app, this).open() });
    this.addCommand({ id: 'add-task', name: 'Add Task', callback: () => new TaskModal(this.app, this).open() });
    this.addCommand({ id: 'new-project', name: 'New Project', callback: () => new ProjectModal(this.app, this).open() });
    this.addCommand({ id: 'weekly-review', name: 'Open Weekly Review', callback: () => {
      this.state.screen = 'review';
      this.refreshAll();
      this.activateView();
    }});

    this.addSettingTab(new ParaHubSettingTab(this.app, this));

    this.registerEvent(this.app.vault.on('modify', async (file) => {
      const typeKey = this.getTypeKeyForPath(file.path);
      if (typeKey) {
        await this.loadFileToCache(file, typeKey, true);
        this.debounceRefresh();
      }
    }));

    this.registerEvent(this.app.vault.on('delete', (file) => {
      const typeKey = this.getTypeKeyForPath(file.path);
      if (typeKey) {
        this.cache[typeKey] = this.cache[typeKey].filter(n => n.file.path !== file.path);
        this.debounceRefresh();
      }
    }));

    this.registerEvent(this.app.vault.on('rename', async (file, oldPath) => {
      const oldType = this.getTypeKeyForPath(oldPath);
      const newType = this.getTypeKeyForPath(file.path);
      if (oldType) this.cache[oldType] = this.cache[oldType].filter(n => n.file.path !== oldPath);
      if (newType) await this.loadFileToCache(file, newType);
      this.debounceRefresh();
    }));
  }

  t(key) {
    const lang = this.data.language || 'en';
    return TRANSLATIONS[lang] && TRANSLATIONS[lang][key] ? TRANSLATIONS[lang][key] : key;
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async loadPluginData() {
    const data = await this.loadData();
    const base = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      onboardingDone: false,
      folders: Object.assign({}, DEFAULT_FOLDERS),
      reviewProgress: {},
      sampleCreated: false,
      language: 'en'
    };
    this.data = Object.assign(base, data || {});
    this.data.folders = Object.assign({}, DEFAULT_FOLDERS, this.data.folders || {});
    this.data.reviewProgress = this.data.reviewProgress || {};
    this.data.language = this.data.language || 'en';
    
    // Future data migrations go here
    if (!this.data.schemaVersion || this.data.schemaVersion < CURRENT_SCHEMA_VERSION) {
      this.data.schemaVersion = CURRENT_SCHEMA_VERSION;
      await this.saveData(this.data);
    }
  }

  async ensureFolders() {
    for (const key of Object.keys(this.data.folders)) {
      const folder = this.data.folders[key];
      if (!folder) continue;
      const existing = this.app.vault.getAbstractFileByPath(normalizePath(folder));
      if (!existing) {
        try { await this.app.vault.createFolder(folder); } catch (e) { /* already exists */ }
      }
    }
  }

  async buildCache() {
    for (const key of Object.keys(this.data.folders)) {
      this.cache[key] = [];
      const folder = this.data.folders[key];
      if (!folder) continue;
      const prefix = normalizePath(folder) + '/';
      const files = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(prefix));
      for (const file of files) {
        await this.loadFileToCache(file, key);
      }
    }
  }

  async loadFileToCache(file, typeKey, replace = false) {
    try {
      const content = await this.app.vault.cachedRead(file);
      const parsed = parseNote(content);
      if (replace) {
        this.cache[typeKey] = this.cache[typeKey].filter(n => n.file.path !== file.path);
      }
      this.cache[typeKey].push({ file, fm: parsed.fm, body: parsed.body });
    } catch (e) { /* skip */ }
  }

  getTypeKeyForPath(path) {
    const normalized = normalizePath(path);
    for (const key of Object.keys(this.data.folders)) {
      const folder = this.data.folders[key];
      if (folder) {
        const prefix = normalizePath(folder) + '/';
        if (normalized.startsWith(prefix)) return key;
      }
    }
    return null;
  }

  debounceRefresh() {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => this.refreshAll(), 300);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf('tab');
      if (!leaf) {
        new Notice('Could not open PARA Hub panel.');
        return;
      }
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  refreshAll() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    for (const leaf of leaves) {
      if (leaf.view && leaf.view.render) leaf.view.render();
    }
  }

  async getNotes(typeKey) {
    return this.cache[typeKey] ? this.cache[typeKey].slice() : [];
  }

  async getTasksForProject(projectName) {
    const tasks = await this.getNotes('tasks');
    return tasks.filter(t => !t.fm.archived && t.fm.project === projectName);
  }

  async noteExists(name, typeKey) {
    if (!name) return false;
    const notes = await this.getNotes(typeKey);
    return notes.some(n => (n.fm.title || n.file.basename) === name);
  }

  async createNote(typeKey, title, frontmatter, body) {
    const folder = this.data.folders[typeKey];
    const folderExists = this.app.vault.getAbstractFileByPath(normalizePath(folder));
    if (!folderExists) {
      try { await this.app.vault.createFolder(folder); } catch (e) { /* already exists */ }
    }
    const base = safeFilename(title);
    const path = await this.uniquePath(folder, base);
    const content = serializeNote(frontmatter, body);
    const file = await this.app.vault.create(path, content);
    
    this.cache[typeKey].push({ file, fm: frontmatter, body });
    
    return file;
  }

  async updateNote(file, frontmatter, body) {
    const current = await this.app.vault.read(file);
    const parsed = parseNote(current);
    const finalBody = (body === undefined) ? parsed.body : body;
    const content = serializeNote(frontmatter, finalBody);
    await this.app.vault.modify(file, content);
    
    const typeKey = this.getTypeKeyForPath(file.path);
    if (typeKey) {
      this.cache[typeKey] = this.cache[typeKey].filter(n => n.file.path !== file.path);
      this.cache[typeKey].push({ file, fm: frontmatter, body: finalBody });
    }
    
    return file;
  }

  async uniquePath(folder, base) {
    let name = base;
    let i = 2;
    let path = normalizePath(folder + '/' + name + '.md');
    while (this.app.vault.getAbstractFileByPath(path)) {
      name = base + ' (' + i + ')';
      path = normalizePath(folder + '/' + name + '.md');
      i++;
    }
    return path;
  }

  async searchAll(q) {
    const results = [];
    const buckets = [
      ['tasks', this.t('nav_tasks')], ['projects', this.t('nav_projects')], ['areas', this.t('nav_areas')],
      ['resources', this.t('nav_resources')], ['inbox', this.t('nav_inbox')],
    ];
    for (const b of buckets) {
      const key = b[0], label = b[1];
      const notes = await this.getNotes(key);
      for (const n of notes) {
        const title = String(n.fm.title || n.file.basename).toLowerCase();
        const body = String(n.body || '').toLowerCase();
        const desc = String(n.fm.description || '').toLowerCase();
        if (title.includes(q) || body.includes(q) || desc.includes(q)) {
          results.push(Object.assign({}, n, { type: label }));
        }
      }
    }
    const archived = [];
    for (const key of ['tasks', 'projects', 'areas', 'resources', 'inbox']) {
      const notes = await this.getNotes(key);
      for (const n of notes) {
        if (n.fm.archived === true || n.fm.archived === 'true') {
          const title = String(n.fm.title || n.file.basename).toLowerCase();
          if (title.includes(q) || String(n.body || '').toLowerCase().includes(q)) {
            archived.push(Object.assign({}, n, { type: this.t('nav_archives') }));
          }
        }
      }
    }
    return results.concat(archived);
  }

  async exportBackup() {
    const folders = this.data.folders;
    const order = ['inbox', 'tasks', 'projects', 'areas', 'resources', 'archives'];
    const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = 'PARA-Backup-' + date;
    let content = '# PARA Hub Backup\n\nCreated: ' + nowISO() + '\n\n';
    content += 'This is a readable copy of your PARA notes. It is not a full vault backup.\n\n';
    
    for (const key of order) {
      const notes = await this.getNotes(key);
      if (notes.length === 0) continue;
      content += '## ' + key + '\n\n';
      for (const n of notes) {
        content += '### ' + (n.fm.title || n.file.basename) + '\n\n';
        content += '```\n';
        try { content += await this.app.vault.read(n.file); } catch (e) { content += '(could not read)'; }
        content += '\n```\n\n';
      }
    }
    const path = await this.uniquePath(folders.archives, filename);
    await this.app.vault.create(path, content);
    new Notice(this.t('msg_backup'));
  }

  async createSampleContent() {
    if (this.data.sampleCreated) {
      new Notice(this.t('msg_sample_add'));
      return;
    }
    this.data.sampleCreated = true;
    await this.saveData(this.data);

    const samples = [
      { folder: 'tasks', title: 'Sample: Read about PARA', fm: { priority: 'medium', status: 'open' } },
      { folder: 'tasks', title: 'Sample: Plan next week', fm: { priority: 'high', status: 'open', due: todayISO() } },
      { folder: 'projects', title: 'Sample: Set up my PARA system', fm: { status: 'active', priority: 'high', outcome: 'A working PARA setup' } },
      { folder: 'areas', title: 'Sample: Health', fm: {} },
      { folder: 'resources', title: 'Sample: Article on PARA', fm: { category: 'Productivity' } },
      { folder: 'inbox', title: 'Sample: Idea for later', fm: {} },
    ];
    for (const s of samples) {
      const fm = {
        'para-type': s.folder.replace(/s$/, ''),
        'para-id': makeId(),
        'title': s.title,
        'description': '',
        'due': '',
        'priority': 'medium',
        'status': 'open',
        'project': '',
        'area': '',
        'created': nowISO(),
        'archived': false,
        'sample': true,
      };
      Object.assign(fm, s.fm);
      try { await this.createNote(s.folder, s.title, fm, ''); } catch (e) { /* skip */ }
    }
    new Notice(this.t('msg_sample_add'));
    this.refreshAll();
  }

  async removeSampleContent() {
    let removed = 0;
    for (const key of ['inbox', 'tasks', 'projects', 'areas', 'resources', 'archives']) {
      const notes = await this.getNotes(key);
      for (const n of notes) {
        if (n.fm.sample === true || n.fm.sample === 'true') {
          try {
            await this.app.vault.delete(n.file);
            this.cache[key] = this.cache[key].filter(x => x.file.path !== n.file.path);
            removed++;
          } catch (e) { /* skip */ }
        }
      }
    }
    this.data.sampleCreated = false;
    await this.saveData(this.data);
    new Notice(this.t('msg_sample_rem') + ' ' + removed);
    this.refreshAll();
  }
}

/* ============================================================
   SETTINGS TAB
   ============================================================ */

class ParaHubSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: this.plugin.t('set_title') });
    containerEl.createEl('p', { text: this.plugin.t('set_desc') });

    new Setting(containerEl)
      .setName(this.plugin.t('set_lang'))
      .setDesc(this.plugin.t('set_lang_desc'))
      .addDropdown(drop => drop
        .addOption('en', 'English')
        .addOption('de', 'Deutsch')
        .setValue(this.plugin.data.language || 'en')
        .onChange(async (val) => {
          this.plugin.data.language = val;
          await this.plugin.saveData(this.plugin.data);
          this.plugin.refreshAll();
          this.display(); // re-render settings tab
        })
      );

    const labels = {
      inbox: this.plugin.t('set_lbl_inbox'),
      tasks: this.plugin.t('set_lbl_tasks'),
      projects: this.plugin.t('set_lbl_proj'),
      areas: this.plugin.t('set_lbl_area'),
      resources: this.plugin.t('set_lbl_res'),
      archives: this.plugin.t('set_lbl_arch'),
    };
    for (const key of Object.keys(labels)) {
      new Setting(containerEl)
        .setName(labels[key])
        .setDesc(this.plugin.t('set_lbl_folder'))
        .addText(t => t
          .setValue(this.plugin.data.folders[key] || '')
          .onChange(async v => {
            this.plugin.data.folders[key] = v.trim() || DEFAULT_FOLDERS[key];
            await this.plugin.saveData(this.plugin.data);
            await this.plugin.ensureFolders();
            await this.plugin.buildCache();
          })
        );
    }

    new Setting(containerEl)
      .setName(this.plugin.t('set_show_again'))
      .setDesc(this.plugin.t('set_show_desc'))
      .addButton(b => b.setButtonText(this.plugin.t('set_show_btn')).onClick(async () => {
        this.plugin.data.onboardingDone = false;
        await this.plugin.saveData(this.plugin.data);
        new Notice(this.plugin.t('set_show_again'));
      }));

    new Setting(containerEl)
      .setName(this.plugin.t('set_backup_title'))
      .setDesc(this.plugin.t('set_backup_desc'))
      .addButton(b => b.setButtonText(this.plugin.t('set_backup')).onClick(async () => {
        try { await this.plugin.exportBackup(); }
        catch (e) { new Notice(this.plugin.t('err_backup')); }
      }));
  }
}

module.exports = ParaHubPlugin;
