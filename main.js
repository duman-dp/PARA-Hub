/* ============================================================
   PARA Hub — Complete Obsidian plugin
   Version 1.0.5 — Stability, safety & formal German
   ============================================================ */

const { Plugin, ItemView, Modal, Setting, PluginSettingTab, Notice, normalizePath, setIcon, Menu } = require('obsidian');

const VIEW_TYPE = 'para-hub-view';
const MAX_RENDER = 100;
const CURRENT_SCHEMA_VERSION = 1;

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
    btn_delete: 'Delete', mod_del_title: 'Delete Permanently', mod_del_desc: 'Are you sure you want to delete this item? This action cannot be undone.', btn_confirm_del: 'Delete permanently',
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
    msg_saved: 'Saved', msg_archived: 'Archived', msg_restored: 'Restored', msg_deleted: 'Deleted successfully', msg_proj_comp: 'Project completed', msg_backup: 'Backup saved to your Archive folder', msg_sample_add: 'Sample content added', msg_sample_rem: 'Removed',
    opt_none: '— None —', opt_low: 'Low', opt_med: 'Medium', opt_high: 'High', opt_open: 'Open', opt_comp: 'Completed', opt_blocked: 'Blocked', opt_active: 'Active', opt_inactive: 'Inactive',
    date_unknown: 'Unknown',
    kind_task: 'Task', kind_project: 'Project', kind_inbox: 'Inbox', proj_not_found: 'Project not found.', area_not_found: 'Area not found.', no_project: '(no project)', btn_clear: 'Clear',
    kind_area: 'Area', kind_resource: 'Resource', ph_short_title: 'Short title', ph_details: 'Details you want to remember', ph_category: 'e.g. Idea, To Read', ph_tasks: 'One task per line', err_open_panel: 'Could not open PARA Hub panel.',
    cmd_open: 'Open PARA Hub', cmd_capture: 'Quick Capture', cmd_task: 'Add Task', cmd_proj: 'New Project', cmd_review: 'Open Weekly Review',
    smp_task1: 'Sample: Read about PARA', smp_task2: 'Sample: Plan next week', smp_proj: 'Sample: Set up my PARA system', smp_outcome: 'A working PARA setup', smp_area: 'Sample: Health', smp_res: 'Sample: Article on PARA', smp_cat: 'Productivity', smp_inbox: 'Sample: Idea for later'
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
    btn_open: 'Öffnen', btn_edit: 'Bearbeiten', btn_archive: 'Archivieren', btn_restore: 'Wiederherstellen', btn_assign: 'Zuweisen', btn_more: 'Weitere Optionen', btn_actions: 'Aktionen', btn_go: 'Aufrufen', btn_reset: 'Fortschritt zurücksetzen',
    btn_delete: 'Löschen', mod_del_title: 'Dauerhaft löschen', mod_del_desc: 'Sind Sie sicher, dass Sie dieses Element dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.', btn_confirm_del: 'Dauerhaft löschen',
    tab_today: 'Heute', tab_over: 'Überfällig', tab_up: 'Anstehend', tab_high: 'Hohe Priorität', tab_open: 'Alle offenen', tab_comp: 'Abgeschlossen', tab_proj: 'Nach Projekt',
    empty_tasks: 'Keine Aufgaben gefunden.', empty_inbox: 'Ihr Eingang ist leer. Verwenden Sie die Schnellerfassung, wenn Ihnen etwas einfällt.',
    empty_proj: 'Noch keine Projekte. Ein Projekt ist alles, was einen klaren Abschluss hat.', empty_area: 'Noch keine Bereiche. Ein Bereich ist etwas, das Sie pflegen, wie Gesundheit oder Finanzen.',
    empty_res: 'Noch keine Ressourcen. Ressourcen sind Dinge, die Sie als Referenz aufbewahren möchten.', empty_arch: 'Nichts ist archiviert.',
    task_no_tasks: 'Keine Aufgaben in dieser Ansicht.', task_showing: 'Es werden die ersten 100 Einträge angezeigt. Verwenden Sie die Suche, um weitere zu finden.',
    task_mark_inc: 'Aufgabe als unerledigt markieren', task_mark_comp: 'Aufgabe als erledigt markieren', task_missing: 'Nicht gefunden:',
    inbox_cat: 'Kategorie:', inbox_archived: 'Archiviert', inbox_updated: 'Eingangselement aktualisiert',
    proj_blocked: 'Blockiert', proj_over: 'Überfällig', proj_soon: 'Bald fällig', proj_inactive: 'Inaktiv', proj_no_prog: 'Fortschritt noch nicht verfügbar', proj_tasks_done: 'Aufgaben abgeschlossen',
    proj_outcome: 'Ergebnis:', proj_desc: 'Beschreibung:', proj_status: 'Status:', proj_prio: 'Priorität:', proj_deadline: 'Frist:', proj_area: 'Bereich:', proj_area_missing: 'Verknüpfter Bereich fehlt:',
    proj_progress: 'Fortschritt', proj_add_task_ph: 'Fügen Sie diesem Projekt eine Aufgabe hinzu…', proj_add: 'Hinzufügen', proj_no_tasks: 'Noch keine Aufgaben. Fügen Sie oben eine hinzu.',
    proj_res: 'Zugehörige Ressourcen', proj_no_res: 'Noch keine Ressourcen verknüpft.', proj_edit: 'Projekt bearbeiten', proj_comp: 'Als abgeschlossen markieren',
    area_proj: 'Projekte in diesem Bereich', area_no_proj: 'Keine Projekte.', area_tasks: 'Aufgaben in diesem Bereich', area_no_tasks: 'Keine Aufgaben.', area_res: 'Ressourcen in diesem Bereich', area_no_res: 'Keine Ressourcen.',
    res_link: 'Link:', res_cat: 'Kategorie:',
    arch_desc: 'Hier wird nichts gelöscht. Stellen Sie alles mit einem Klick wieder her.', arch_type: 'Typ:',
    rev_desc: 'Eine geführte Checkliste, die Ihnen hilft, zu reflektieren und zu planen.',
    rev_1: 'Eingang überprüfen', rev_1_h: 'Sortieren Sie Ihren Eingang oder lassen Sie Einträge dort liegen.',
    rev_2: 'Überfällige Aufgaben erledigen', rev_2_h: 'Schließen Sie überfällige Aufgaben ab, verschieben Sie sie oder archivieren Sie sie.',
    rev_3: 'Anstehende Fristen prüfen', rev_3_h: 'Sehen Sie sich an, was in den nächsten zwei Wochen fällig ist.',
    rev_4: 'Aktive Projekte überprüfen', rev_4_h: 'Öffnen Sie jedes aktive Projekt und prüfen Sie den Status.',
    rev_5: 'Blockierte oder vernachlässigte Projekte prüfen', rev_5_h: 'Markieren Sie alles, was ins Stocken geraten ist.',
    rev_6: 'Prioritäten aktualisieren', rev_6_h: 'Erhöhen oder senken Sie die Priorität dessen, was diese Woche am wichtigsten ist.',
    rev_7: 'Fertige Projekte abschließen oder archivieren', rev_7_h: 'Wenn ein Projekt fertig ist, markieren Sie es als abgeschlossen oder archivieren Sie es.',
    rev_8: 'Nächste Schritte definieren', rev_8_h: 'Fügen Sie für jedes aktive Projekt mindestens eine nächste Aufgabe hinzu.',
    rev_9: 'Für die Woche vorbereiten', rev_9_h: 'Notieren Sie Ihre drei wichtigsten Prioritäten.',
    search_results: 'Suchergebnisse', search_empty: 'Geben Sie etwas in das Suchfeld oben ein.', search_none: 'Keine Treffer für', search_open: 'Notiz öffnen',
    set_para: 'Was ist PARA?', set_para_desc: 'PARA ist eine Methode, um alles in Ihrem Leben in fünf Kategorien zu organisieren: Projekte (Vorhaben mit klarem Abschluss), Bereiche (laufende Verantwortlichkeiten), Ressourcen (Referenzmaterial), Archiv (inaktive Dinge, die niemals gelöscht werden) und Eingang (vorübergehende Ablage).',
    set_actions: 'Häufige Aktionen', set_a1: 'Aufgabe hinzufügen: Klicken Sie auf der Startseite auf "Aufgabe hinzufügen".', set_a2: 'Gedanken erfassen: Klicken Sie auf der Startseite auf "Schnellerfassung" oder verwenden Sie die Befehlspalette.', set_a3: 'Projekt starten: Klicken Sie auf "Neues Projekt".', set_a4: 'Wochenrückblick: Klicken Sie auf "Wochenrückblick" und haken Sie jeden Schritt ab.', set_a5: 'Sichern: Klicken Sie unten auf "Jetzt sichern".',
    set_tools: 'Werkzeuge', set_backup: 'Jetzt sichern', set_reset: 'Willkommensbildschirm erneut anzeigen', set_remove: 'Beispielinhalte entfernen',
    set_title: 'PARA Hub Einstellungen', set_desc: 'Diese Einstellungen legen fest, wo Ihre Notizen gespeichert werden. Das Ändern eines Ordnernamens verschiebt Ihre vorhandenen Notizen nicht; es ändert nur, wo neue Notizen gespeichert werden.',
    set_lang: 'Sprache', set_lang_desc: 'Wählen Sie die Sprache für die Benutzeroberfläche.',
    set_lbl_inbox: 'Eingangsnotizen', set_lbl_tasks: 'Aufgabennotizen', set_lbl_proj: 'Projektnotizen', set_lbl_area: 'Bereichsnotizen', set_lbl_res: 'Ressourcennotizen', set_lbl_arch: 'Archivnotizen', set_lbl_folder: 'Ordnername',
    set_show_again: 'Willkommensbildschirm erneut anzeigen', set_show_desc: 'Schaltet den ersten Willkommensbildschirm wieder ein.', set_show_btn: 'Erneut anzeigen',
    set_backup_title: 'Sichern Sie Ihre PARA-Daten', set_backup_desc: 'Schreibt eine datierte Kopie Ihrer PARA-Notizen in Ihren Archivordner. Dies ist eine lesbare Kopie, kein vollständiges Vault-Backup.',
    onb_title: 'Willkommen bei PARA Hub', onb_sub: 'Eine einfache Möglichkeit, alles in Ihrem Vault zu organisieren.',
    onb_p: 'Projekte', onb_pd: 'Vorhaben mit klarem Abschluss', onb_a: 'Bereiche', onb_ad: 'laufende Verantwortlichkeiten', onb_r: 'Ressourcen', onb_rd: 'Referenzmaterial', onb_ar: 'Archiv', onb_ard: 'inaktive Dinge (niemals gelöscht)', onb_i: 'Eingang', onb_id: 'vorübergehende Ablage',
    onb_t_btn: 'Erstellen Sie Ihre erste Aufgabe', onb_p_btn: 'Erstellen Sie Ihr erstes Projekt', onb_skip: 'Überspringen', onb_sample: 'Sie wissen nicht, wo Sie anfangen sollen? Fügen Sie einige Beispieleinträge hinzu (mit "Beispiel:" gekennzeichnet) – Sie können diese mit einem Klick wieder entfernen.', onb_add_sample: 'Beispielinhalte hinzufügen',
    mod_cap: 'Schnellerfassung', mod_cap_desc: 'Alles, was Sie hier eingeben, landet in Ihrem Eingang. Sie können es später sortieren.',
    mod_title_req: 'Titel (erforderlich)', mod_content: 'Inhalt (optional)', mod_cat: 'Kategorie (optional)', mod_save_inbox: 'Im Eingang speichern', mod_cancel: 'Abbrechen',
    mod_task: 'Aufgabe hinzufügen', mod_edit_task: 'Aufgabe bearbeiten', mod_desc: 'Beschreibung (optional)', mod_due: 'Fälligkeitsdatum (optional)', mod_prio: 'Priorität', mod_status: 'Status', mod_proj: 'Zugehöriges Projekt (optional)', mod_area: 'Zugehöriger Bereich (optional)', mod_notes: 'Notizen (optional)', mod_save_task: 'Aufgabe speichern',
    mod_new_proj: 'Neues Projekt', mod_edit_proj: 'Projekt bearbeiten', mod_name_req: 'Name (erforderlich)', mod_outcome: 'Gewünschtes Ergebnis', mod_desc_req: 'Beschreibung', mod_init_tasks: 'Erste Aufgaben (eine pro Zeile, optional)', mod_save_proj: 'Projekt speichern',
    mod_new_area: 'Neuer Bereich', mod_edit_area: 'Bereich bearbeiten', mod_save_area: 'Bereich speichern',
    mod_new_res: 'Neue Ressource', mod_edit_res: 'Ressource bearbeiten', mod_link: 'Link (optional)', mod_save_res: 'Ressource speichern',
    mod_assign: 'Eingangselement zuweisen', mod_assign_desc: 'Verknüpfen Sie dieses Element mit einem Projekt, Bereich oder einer Ressource — oder senden Sie es ins Archiv.', mod_dest: 'Wählen Sie ein Ziel', mod_leave: '— Im Eingang lassen —', mod_do_assign: 'Zuweisen',
    err_title: 'Bitte geben Sie einen Titel ein', err_name: 'Bitte geben Sie einen Namen ein', err_save: 'Das Speichern ist fehlgeschlagen. Bitte versuchen Sie es erneut.', err_update: 'Die Aktualisierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', err_arch: 'Die Archivierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', err_restore: 'Die Wiederherstellung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', err_backup: 'Die Sicherung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
    msg_saved: 'Gespeichert', msg_archived: 'Archiviert', msg_restored: 'Wiederhergestellt', msg_deleted: 'Erfolgreich gelöscht', msg_proj_comp: 'Projekt abgeschlossen', msg_backup: 'Sicherung im Archivordner gespeichert', msg_sample_add: 'Beispielinhalte hinzugefügt', msg_sample_rem: 'Entfernt:',
    opt_none: '— Keine —', opt_low: 'Niedrig', opt_med: 'Mittel', opt_high: 'Hoch', opt_open: 'Offen', opt_comp: 'Abgeschlossen', opt_blocked: 'Blockiert', opt_active: 'Aktiv', opt_inactive: 'Inaktiv',
    date_unknown: 'Unbekannt',
    kind_task: 'Aufgabe', kind_project: 'Projekt', kind_inbox: 'Eingang', proj_not_found: 'Projekt nicht gefunden.', area_not_found: 'Bereich nicht gefunden.', no_project: '(kein Projekt)', btn_clear: 'Leeren',
    kind_area: 'Bereich', kind_resource: 'Ressource', ph_short_title: 'Kurzer Titel', ph_details: 'Details, die Sie sich merken möchten', ph_category: 'z. B. Idee, Zum Lesen', ph_tasks: 'Eine Aufgabe pro Zeile', err_open_panel: 'Der PARA-Hub-Bereich konnte nicht geöffnet werden.',
    cmd_open: 'PARA Hub öffnen', cmd_capture: 'Schnellerfassung', cmd_task: 'Aufgabe hinzufügen', cmd_proj: 'Neues Projekt', cmd_review: 'Wochenrückblick öffnen',
    smp_task1: 'Beispiel: Über PARA lesen', smp_task2: 'Beispiel: Nächste Woche planen', smp_proj: 'Beispiel: Mein PARA-System einrichten', smp_outcome: 'Ein funktionierendes PARA-System', smp_area: 'Beispiel: Gesundheit', smp_res: 'Beispiel: Artikel über PARA', smp_cat: 'Produktivität', smp_inbox: 'Beispiel: Idee für später'
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

function pad2(n) {
  return String(n).padStart(2, '0');
}

function nowISO() {
  const d = new Date();
  return todayISO() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}

function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.getFullYear() + '-' +
    pad2(d.getMonth() + 1) + '-' +
    pad2(d.getDate());
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Identifier used to find a note again after a click (falls back to the file path
// when a note has no para-id, e.g. a note created by hand).
function noteId(n) {
  return String((n.fm && n.fm['para-id']) || n.file.path);
}

// Selects a value in a dropdown; if the value is not one of the options
// (e.g. the linked project was deleted) it is added, so saving never silently drops the link.
function setSelectValue(select, value) {
  if (value && !Array.from(select.options).some(o => o.value === value)) {
    select.createEl('option', { value: value, text: value });
  }
  select.value = value || '';
}

// Makes a title safe to use as a file name on Windows, macOS and Linux
// (and safe for Obsidian links).
function safeFilename(title) {
  let base = String(title || '')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')   // control characters / newlines
    .replace(/[\\/:*?"<>|#^\[\]]/g, '-')             // illegal or link-breaking characters
    .replace(/\s+/g, ' ')
    .trim();
  base = Array.from(base).slice(0, 80).join('');      // cut by characters, never in the middle of an emoji
  base = base.replace(/^\.+/, '').replace(/[. ]+$/, '').trim(); // no hidden files, no trailing dot/space (Windows)
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(base)) base = '_' + base; // Windows reserved names
  return base || 'Untitled';
}

function unquoteYaml(raw) {
  const v = String(raw).trim();
  if (v.length >= 2 && v[0] === '"' && v[v.length - 1] === '"') {
    return v.slice(1, -1).replace(/\\(["\\nrt])/g, (m, c) => (c === 'n' ? '\n' : c === 'r' ? '\r' : c === 't' ? '\t' : c));
  }
  if (v.length >= 2 && v[0] === "'" && v[v.length - 1] === "'") {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  if (/^true$/i.test(v)) return true;
  if (/^false$/i.test(v)) return false;
  if (/^-?\d{1,15}$/.test(v)) return parseInt(v, 10);
  return v;
}

function parseNote(content) {
  const text = String(content || '').replace(/\r\n?/g, '\n');
  if (!/^---[ \t]*\n/.test(text)) {
    return { fm: {}, body: text };
  }
  const rest = text.slice(3);
  const m = rest.match(/\n---[ \t]*(\n|$)/);
  if (!m) return { fm: {}, body: text };
  const fmText = rest.slice(0, m.index);
  const body = rest.slice(m.index + m[0].length).replace(/^\n+/, '');
  const fm = {};
  for (const line of fmText.split('\n')) {
    if (!line.trim() || /^\s/.test(line) || line[0] === '#' || line[0] === '-') continue;
    const km = line.match(/^([^:]+):(.*)$/);
    if (!km) continue;
    const key = km[1].trim();
    if (!key || key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    fm[key] = unquoteYaml(km[2]);
  }
  return { fm, body };
}

function yamlValue(v) {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  const str = String(v);
  if (str === '') return '';
  const isPlain = /^[\p{L}\p{N}][\p{L}\p{N} _.,\/()+-]*$/u.test(str) && str === str.trim();
  const looksSpecial = /^(true|false|null|yes|no|on|off|~)$/i.test(str) || /^[-+]?[\d.]+$/.test(str);
  if (isPlain && !looksSpecial) return str;
  // Quote and escape so that colons, quotes, backslashes and line breaks can never break the file.
  return '"' + str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t') + '"';
}

function serializeNote(fm, body) {
  const lines = [];
  for (const key of Object.keys(fm)) {
    const v = fm[key];
    if (v === undefined || v === null) continue;
    const safeKey = String(key).replace(/[:\r\n]/g, '-');
    lines.push(safeKey + ': ' + yamlValue(v));
  }
  return '---\n' + lines.join('\n') + '\n---\n\n' + (body || '');
}

/* ============================================================
   MODALS
   ============================================================ */

class ConfirmDeleteModal extends Modal {
  constructor(app, plugin, file, typeKey, onDeleted) {
    super(app);
    this.plugin = plugin;
    this.file = file;
    this.typeKey = typeKey;
    this.onDeleted = onDeleted;
    this.deleting = false;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('para-modal');
    contentEl.createEl('h2', { text: this.plugin.t('mod_del_title') });
    contentEl.createEl('p', { text: this.plugin.t('mod_del_desc'), attr: { style: 'color: var(--text-error); font-weight: 500;' } });

    const row = contentEl.createDiv({ cls: 'para-modal-actions' });
    const cancel = row.createEl('button', { text: this.plugin.t('mod_cancel'), cls: 'para-btn' });
    cancel.addEventListener('click', () => this.close());
    
    const delBtn = row.createEl('button', { text: this.plugin.t('btn_confirm_del'), cls: 'para-btn' });
    delBtn.style.backgroundColor = 'var(--text-error)';
    delBtn.style.color = 'white';
    delBtn.style.borderColor = 'var(--text-error)';
    delBtn.addEventListener('click', async () => {
      if (this.deleting) return;
      this.deleting = true;
      try {
        await this.app.vault.delete(this.file);
        this.plugin.dropFromCache(this.file);
        new Notice(this.plugin.t('msg_deleted'));
        this.close();
        if (this.onDeleted) this.onDeleted();
        this.plugin.refreshAll();
      } catch (e) {
        console.error(e);
        new Notice(this.plugin.t('err_save'));
        this.deleting = false;
      }
    });
  }
  onClose() { this.contentEl.empty(); }
}

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
    this.titleInput = contentEl.createEl('input', { type: 'text', cls: 'para-input', placeholder: this.plugin.t('ph_short_title') });

    contentEl.createEl('label', { text: this.plugin.t('mod_content') }).addClass('para-label');
    this.contentInput = contentEl.createEl('textarea', { cls: 'para-textarea', placeholder: this.plugin.t('ph_details') });

    contentEl.createEl('label', { text: this.plugin.t('mod_cat') }).addClass('para-label');
    this.categoryInput = contentEl.createEl('input', { type: 'text', cls: 'para-input', placeholder: this.plugin.t('ph_category') });

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
    setSelectValue(this.projectSelect, fm.project || '');

    contentEl.createEl('label', { text: this.plugin.t('mod_area') }).addClass('para-label');
    this.areaSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.areaSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const a of areas) {
      this.areaSelect.createEl('option', { value: a.fm.title || a.file.basename, text: a.fm.title || a.file.basename });
    }
    setSelectValue(this.areaSelect, fm.area || '');

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
    setSelectValue(this.areaSelect, fm.area || '');

    if (!this.existing) {
      contentEl.createEl('label', { text: this.plugin.t('mod_init_tasks') }).addClass('para-label');
      this.initialTasksInput = contentEl.createEl('textarea', { cls: 'para-textarea', placeholder: this.plugin.t('ph_tasks') });
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
        await this.plugin.renameReferences('project', this.existing.fm.title || this.existing.file.basename, title);
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
        await this.plugin.renameReferences('area', this.existing.fm.title || this.existing.file.basename, title);
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
    setSelectValue(this.projectSelect, fm.project || '');

    contentEl.createEl('label', { text: this.plugin.t('mod_area') }).addClass('para-label');
    this.areaSelect = contentEl.createEl('select', { cls: 'para-input' });
    this.areaSelect.createEl('option', { value: '', text: this.plugin.t('opt_none') });
    for (const a of areas) {
      this.areaSelect.createEl('option', { value: a.fm.title || a.file.basename, text: a.fm.title || a.file.basename });
    }
    setSelectValue(this.areaSelect, fm.area || '');

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
    this.saving = false;
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
      if (this.saving) return;
      const val = select.value;
      if (!val) { this.close(); return; }
      const parts = val.split('::');
      const kind = parts[0];
      const name = parts[1];
      const fm = {};
      if (kind === 'project') fm.project = name;
      else if (kind === 'area') fm.area = name;
      else if (kind === 'resource') fm.resource = name;
      else if (kind === 'archive') fm.archived = true;
      this.saving = true;
      try {
        await this.plugin.updateNote(this.note.file, fm);
        new Notice(this.plugin.t('inbox_updated'));
        this.close();
        this.plugin.refreshAll();
      } catch (e) {
        console.error(e);
        new Notice(this.plugin.t('err_update'));
        this.saving = false;
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
    // Every call gets a number. If a newer render starts while this one is still
    // waiting, the older one stops, so the screen can never be drawn twice.
    const token = (this.renderToken = (this.renderToken || 0) + 1);
    const root = this.contentEl;
    const state = this.plugin.state;
    const screenKey = state.screen + ':' + (state.params && (state.params.projectId || state.params.areaId) || '') + ':' + (state.taskFilter || '');

    // Remember scroll position and search-box focus so a refresh does not disturb the user.
    const oldBody = root.querySelector('.para-body');
    const keepScroll = oldBody && this.lastScreenKey === screenKey ? oldBody.scrollTop : 0;
    const oldSearch = root.querySelector('.para-search');
    const keepFocus = !!oldSearch && document.activeElement === oldSearch;
    const keepCaret = keepFocus ? oldSearch.selectionStart : null;
    this.lastScreenKey = screenKey;

    root.empty();
    root.addClass('para-hub');

    this.renderHeader(root);
    this.renderNav(root);

    const body = root.createDiv({ cls: 'para-body' });

    // Wait until the startup cache is complete; the plugin re-renders as soon as it is.
    if (!this.plugin.ready) return;

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
      if (token !== this.renderToken) return;
      body.createEl('p', { cls: 'para-error', text: this.plugin.t('err_save') });
    }

    if (token !== this.renderToken) return;

    if (!this.plugin.data.onboardingDone) {
      this.renderOnboarding(root);
    }

    if (keepScroll) body.scrollTop = keepScroll;
    if (keepFocus) {
      const newSearch = root.querySelector('.para-search');
      if (newSearch) {
        newSearch.focus();
        try { newSearch.setSelectionRange(keepCaret, keepCaret); } catch (e) { /* ignore */ }
      }
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
    const clear = this.iconButton(searchWrap, 'x', this.plugin.t('btn_clear'));
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
    const attention = projects.filter(p => {
      if (p.fm.archived || p.fm.status === 'completed' || p.fm.status === 'inactive') return false;
      if (p.fm.status === 'blocked') return true;
      if (p.fm.status !== 'active') return false;
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
      .concat(tasks.map(t => ({ ...t, kind: this.plugin.t('kind_task') })))
      .concat(projects.map(t => ({ ...t, kind: this.plugin.t('kind_project') })))
      .concat(inbox.map(t => ({ ...t, kind: this.plugin.t('kind_inbox') })));
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
      if (t.fm.due) row.createEl('span', { cls: 'para-muted', text: this.plugin.fmtDate(t.fm.due) });
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
      if (p.fm.deadline) row.createEl('span', { cls: 'para-muted', text: this.plugin.fmtDate(p.fm.deadline) });
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
      const groups = Object.create(null);
      for (const t of tasks) {
        const key = t.fm.project || this.plugin.t('no_project');
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

  renderTaskRow(parent, note) {
    let priority = String(note.fm.priority || 'medium').toLowerCase();
    if (priority !== 'low' && priority !== 'medium' && priority !== 'high') priority = 'medium';
    const isCompleted = note.fm.status === 'completed';
    const row = parent.createDiv({ cls: 'para-task-row para-priority-' + priority + (isCompleted ? ' is-completed' : '') });

    const checkWrap = row.createDiv({ cls: 'para-check-wrap' });
    const check = checkWrap.createEl('input', { type: 'checkbox', cls: 'para-check' });
    check.checked = isCompleted;
    check.setAttribute('aria-label', isCompleted ? this.plugin.t('task_mark_inc') : this.plugin.t('task_mark_comp'));
    check.addEventListener('change', async () => {
      if (check.disabled) return;
      check.disabled = true; // a second click cannot start a second save
      const fm = {};
      fm.status = check.checked ? 'completed' : 'open';
      try {
        await this.plugin.updateNote(note.file, fm);
        this.plugin.refreshAll();
      } catch (e) {
        console.error(e);
        check.disabled = false;
        check.checked = !check.checked;
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
      pill.createSpan({ text: this.plugin.fmtDate(note.fm.due) });
    }
    if (note.fm.priority) {
      const pill = meta.createSpan({ cls: 'para-pill' });
      const pic = pill.createSpan({ cls: 'para-pill-icon' });
      setIcon(pic, 'flag');
      pill.createSpan({ text: this.plugin.fmtValue('priority', note.fm.priority) });
    }
    
    if (note.fm.project) {
      const exists = this.plugin.noteExistsSync(note.fm.project, 'projects');
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
        const fm = {}; fm.archived = true;
        try { await this.plugin.updateNote(note.file, fm); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_arch')); }
      }));
      menu.addSeparator();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
        new ConfirmDeleteModal(this.app, this.plugin, note.file, 'tasks').open();
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
          const fm = {}; fm.archived = true;
          try { await this.plugin.updateNote(item.file, fm); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.addSeparator();
        menu.addItem((itemMenu) => itemMenu.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
          new ConfirmDeleteModal(this.app, this.plugin, item.file, 'inbox').open();
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
      openBtn.addEventListener('click', () => this.go('project', { projectId: noteId(p) }));
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new ProjectModal(this.app, this.plugin, p).open()));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
          const fm = {}; fm.archived = true;
          try { await this.plugin.updateNote(p.file, fm); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
          new ConfirmDeleteModal(this.app, this.plugin, p.file, 'projects').open();
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
    const project = projects.find(p => noteId(p) === id);
    if (!project) {
      this.renderEmpty(body, 'alert-circle', this.plugin.t('proj_not_found'));
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
        const fm = {}; fm.status = 'completed';
        try { await this.plugin.updateNote(project.file, fm); new Notice(this.plugin.t('msg_proj_comp')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_update')); }
      }));
      menu.addSeparator();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_archive')).setIcon('archive').onClick(async () => {
        const fm = {}; fm.archived = true;
        try { await this.plugin.updateNote(project.file, fm); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_arch')); }
      }));
      menu.addSeparator();
      menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
        new ConfirmDeleteModal(this.app, this.plugin, project.file, 'projects', () => this.go('projects')).open();
      }));
      menu.showAtMouseEvent(evt);
    });

    body.createEl('h2', { text: project.fm.title || project.file.basename });
    const info = body.createDiv({ cls: 'para-panel' });
    if (project.fm.outcome) info.createEl('p', { text: this.plugin.t('proj_outcome') + ' ' + project.fm.outcome });
    if (project.fm.description) info.createEl('p', { text: this.plugin.t('proj_desc') + ' ' + project.fm.description });
    if (project.fm.status) info.createEl('p', { text: this.plugin.t('proj_status') + ' ' + this.plugin.fmtValue('status', project.fm.status) });
    if (project.fm.priority) info.createEl('p', { text: this.plugin.t('proj_prio') + ' ' + this.plugin.fmtValue('priority', project.fm.priority) });
    if (project.fm.deadline) info.createEl('p', { text: this.plugin.t('proj_deadline') + ' ' + this.plugin.fmtDate(project.fm.deadline) });
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
    let adding = false;
    const addFn = async () => {
      if (adding) return;
      const val = inlineInput.value.trim();
      if (!val) return;
      adding = true;
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
      } catch (e) { console.error(e); adding = false; new Notice(this.plugin.t('err_save')); }
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
      openBtn.addEventListener('click', () => this.go('area', { areaId: noteId(a) }));
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_edit')).setIcon('pencil').onClick(() => new AreaModal(this.app, this.plugin, a).open()));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
          new ConfirmDeleteModal(this.app, this.plugin, a.file, 'areas').open();
        }));
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
    const area = areas.find(a => noteId(a) === id);
    if (!area) {
      this.renderEmpty(body, 'alert-circle', this.plugin.t('area_not_found'));
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
          const fm = {}; fm.archived = true;
          try { await this.plugin.updateNote(r.file, fm); new Notice(this.plugin.t('msg_archived')); this.plugin.refreshAll(); }
          catch (e) { new Notice(this.plugin.t('err_arch')); }
        }));
        menu.addSeparator();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
          new ConfirmDeleteModal(this.app, this.plugin, r.file, 'resources').open();
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
      card.createEl('p', { cls: 'para-muted', text: this.plugin.t('arch_type') + ' ' + this.plugin.fmtValue('type', n.fm['para-type'] || n.folderKey) });
      const actions = card.createDiv({ cls: 'para-row' });
      
      const restoreBtn = actions.createEl('button', { cls: 'para-btn para-btn-small para-btn-primary' });
      const rIc = restoreBtn.createSpan({ cls: 'para-btn-icon' });
      setIcon(rIc, 'rotate-ccw');
      restoreBtn.createSpan({ text: this.plugin.t('btn_restore') });
      restoreBtn.addEventListener('click', async () => {
        const fm = {}; fm.archived = false;
        try { await this.plugin.updateNote(n.file, fm); new Notice(this.plugin.t('msg_restored')); this.plugin.refreshAll(); }
        catch (e) { new Notice(this.plugin.t('err_restore')); }
      });
      
      const moreBtn = this.iconButton(actions, 'more-horizontal', this.plugin.t('btn_more'));
      moreBtn.addEventListener('click', (evt) => {
        const menu = new Menu();
        menu.addItem((item) => item.setTitle(this.plugin.t('btn_delete')).setIcon('trash').onClick(() => {
          new ConfirmDeleteModal(this.app, this.plugin, n.file, n.folderKey).open();
        }));
        menu.showAtMouseEvent(evt);
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
  emptyCache() {
    return { inbox: [], tasks: [], projects: [], areas: [], resources: [], archives: [] };
  }

  async onload() {
    // Safe defaults first, so nothing can break while the plugin is still starting.
    this.cache = this.emptyCache();
    this.ready = false;
    this.writeChain = Promise.resolve();
    this.refreshTimeout = null;
    this.rebuildTimeout = null;
    this.state = {
      screen: 'home',
      params: {},
      searchQuery: '',
      taskFilter: 'today',
    };

    await this.loadPluginData();
    try { await this.ensureFolders(); } catch (e) { console.error(e); }

    this.registerView(VIEW_TYPE, (leaf) => new ParaHubView(leaf, this));
    this.addRibbonIcon('layout-dashboard', this.t('cmd_open'), () => this.activateView());

    this.addCommand({ id: 'open-para-hub', name: this.t('cmd_open'), callback: () => this.activateView() });
    this.addCommand({ id: 'quick-capture', name: this.t('cmd_capture'), callback: () => new QuickCaptureModal(this.app, this).open() });
    this.addCommand({ id: 'add-task', name: this.t('cmd_task'), callback: () => new TaskModal(this.app, this).open() });
    this.addCommand({ id: 'new-project', name: this.t('cmd_proj'), callback: () => new ProjectModal(this.app, this).open() });
    this.addCommand({ id: 'weekly-review', name: this.t('cmd_review'), callback: () => {
      this.state.screen = 'review';
      this.state.params = {};
      this.refreshAll();
      this.activateView();
    }});

    this.addSettingTab(new ParaHubSettingTab(this.app, this));

    // Wait for Obsidian to fully load the vault before reading files.
    // The screen only draws its content once `ready` is true.
    this.app.workspace.onLayoutReady(async () => {
      try { await this.buildCache(); } catch (e) { console.error(e); }
      this.ready = true;
      this.refreshAll();
    });

    const isNote = (f) => !!f && f.extension === 'md';

    // All listeners are registered with registerEvent, so Obsidian removes them when the plugin is unloaded.
    this.registerEvent(this.app.vault.on('create', async (file) => {
      if (!this.ready || !isNote(file)) return;
      const typeKey = this.getTypeKeyForPath(file.path);
      if (typeKey) {
        await this.loadFileToCache(file, typeKey);
        this.debounceRefresh();
      }
    }));

    this.registerEvent(this.app.vault.on('modify', async (file) => {
      if (!this.ready || !isNote(file)) return;
      const typeKey = this.getTypeKeyForPath(file.path);
      if (typeKey) {
        await this.loadFileToCache(file, typeKey);
        this.debounceRefresh();
      }
    }));

    this.registerEvent(this.app.vault.on('delete', (file) => {
      if (!this.ready) return;
      this.dropFromCache(file);
      this.debounceRefresh();
    }));

    this.registerEvent(this.app.vault.on('rename', async (file, oldPath) => {
      if (!this.ready) return;
      if (!isNote(file)) {
        // A whole folder was renamed or moved: simply rebuild the index.
        this.scheduleRebuild();
        return;
      }
      // The cached entry points to the same file object, which already has the new path.
      this.dropFromCache(file);
      const typeKey = this.getTypeKeyForPath(file.path);
      if (typeKey) await this.loadFileToCache(file, typeKey);
      this.debounceRefresh();
    }));
  }

  t(key) {
    const lang = (this.data && this.data.language) || 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (dict[key] !== undefined) return dict[key];
    if (TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
    return key;
  }

  async onunload() {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    if (this.rebuildTimeout) clearTimeout(this.rebuildTimeout);
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
    this.data.language = TRANSLATIONS[this.data.language] ? this.data.language : 'en';
    
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
        try { await this.app.vault.createFolder(normalizePath(folder)); } catch (e) { /* already exists */ }
      }
    }
  }

  /* ---------------- cache ---------------- */

  async buildCache() {
    // Build into a fresh object and swap at the end, so the screen never sees a half-built cache.
    const fresh = this.emptyCache();
    const allFiles = this.app.vault.getMarkdownFiles();
    const keys = Object.keys(this.data.folders);
    for (const file of allFiles) {
      const typeKey = this.getTypeKeyForPath(file.path);
      if (!typeKey || !keys.includes(typeKey)) continue;
      try {
        const content = await this.app.vault.cachedRead(file);
        const parsed = parseNote(content);
        this.normalizeFm(parsed.fm);
        if (!fresh[typeKey]) fresh[typeKey] = [];
        fresh[typeKey].push({ file, fm: parsed.fm, body: parsed.body });
      } catch (e) { /* skip unreadable file */ }
    }
    this.cache = fresh;
  }

  scheduleRebuild() {
    if (this.rebuildTimeout) clearTimeout(this.rebuildTimeout);
    this.rebuildTimeout = setTimeout(async () => {
      this.rebuildTimeout = null;
      try { await this.buildCache(); } catch (e) { console.error(e); }
      this.refreshAll();
    }, 500);
  }

  // Makes "true"/"false" written as text behave like real yes/no values.
  normalizeFm(fm) {
    for (const k of ['archived', 'sample']) {
      if (fm[k] === 'true') fm[k] = true;
      else if (fm[k] === 'false') fm[k] = false;
    }
    return fm;
  }

  // Inserts or replaces a cache entry (matched by file), never creating duplicates.
  putCache(typeKey, entry) {
    if (!this.cache[typeKey]) this.cache[typeKey] = [];
    const list = this.cache[typeKey];
    const idx = list.findIndex(n => n.file === entry.file || n.file.path === entry.file.path);
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
  }

  // Removes a file (or everything inside a deleted/moved folder) from the cache.
  dropFromCache(file) {
    const path = file.path;
    for (const key of Object.keys(this.cache)) {
      this.cache[key] = this.cache[key].filter(n => n.file !== file && n.file.path !== path && !n.file.path.startsWith(path + '/'));
    }
  }

  async loadFileToCache(file, typeKey) {
    try {
      const content = await this.app.vault.read(file);
      const parsed = parseNote(content);
      this.normalizeFm(parsed.fm);
      // A file lives in exactly one bucket.
      for (const key of Object.keys(this.cache)) {
        if (key !== typeKey) this.cache[key] = this.cache[key].filter(n => n.file !== file);
      }
      this.putCache(typeKey, { file, fm: parsed.fm, body: parsed.body });
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
    this.refreshTimeout = setTimeout(() => {
      this.refreshTimeout = null;
      this.refreshAll();
    }, 300);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf('tab');
      if (!leaf) {
        new Notice(this.t('err_open_panel'));
        return;
      }
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    await workspace.revealLeaf(leaf);
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

  // Date shown to the user: 22.10.2026 in German, 2026-10-22 in English. (Stored files always keep 2026-10-22.)
  fmtDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (m && this.data.language === 'de') return m[3] + '.' + m[2] + '.' + m[1];
    return iso;
  }

  // Translates stored values such as priority "high" or status "active" for display.
  fmtValue(kind, value) {
    const maps = {
      priority: { low: 'opt_low', medium: 'opt_med', high: 'opt_high' },
      status: { open: 'opt_open', completed: 'opt_comp', blocked: 'opt_blocked', active: 'opt_active', inactive: 'opt_inactive' },
      type: { task: 'kind_task', project: 'kind_project', inbox: 'kind_inbox', area: 'kind_area', resource: 'kind_resource' },
    };
    const key = maps[kind] && maps[kind][String(value).toLowerCase()];
    return key ? this.t(key) : value;
  }

  noteExistsSync(name, typeKey) {
    if (!name) return false;
    const notes = this.cache[typeKey] || [];
    return notes.some(n => (n.fm.title || n.file.basename) === name);
  }

  async noteExists(name, typeKey) {
    return this.noteExistsSync(name, typeKey);
  }

  /* ---------------- writing files ---------------- */

  // All file writes run one after another. Two quick clicks (or two saves at the
  // same millisecond) can therefore never pick the same file name or overwrite each other.
  enqueueWrite(task) {
    const result = this.writeChain.then(task);
    this.writeChain = result.catch(() => {});
    return result;
  }

  createNote(typeKey, title, frontmatter, body) {
    return this.enqueueWrite(() => this.createNoteNow(typeKey, title, frontmatter, body));
  }

  async createNoteNow(typeKey, title, frontmatter, body) {
    const folder = this.data.folders[typeKey] || DEFAULT_FOLDERS[typeKey];
    const folderExists = this.app.vault.getAbstractFileByPath(normalizePath(folder));
    if (!folderExists) {
      try { await this.app.vault.createFolder(normalizePath(folder)); } catch (e) { /* already exists */ }
    }
    const base = safeFilename(title);
    const content = serializeNote(frontmatter, body);
    let file = null;
    let lastError = null;
    for (let attempt = 1; attempt <= 6 && !file; attempt++) {
      const path = await this.uniquePath(folder, base, attempt);
      try {
        file = await this.app.vault.create(path, content);
      } catch (e) {
        lastError = e; // e.g. the name was taken a moment ago: try the next free name
      }
    }
    if (!file) throw (lastError || new Error('Could not create note'));

    this.normalizeFm(frontmatter);
    this.putCache(typeKey, { file, fm: frontmatter, body: body || '' });
    return file;
  }

  // Changes only the fields you pass; every other field and the note text are re-read from the file,
  // so nothing newer on disk is overwritten by an old copy.
  updateNote(file, frontmatter, body) {
    return this.enqueueWrite(() => this.updateNoteNow(file, frontmatter, body));
  }

  async updateNoteNow(file, frontmatter, body) {
    const current = await this.app.vault.read(file);
    const parsed = parseNote(current);
    const finalFm = this.normalizeFm(Object.assign({}, parsed.fm, frontmatter));
    const finalBody = (body === undefined) ? parsed.body : body;
    await this.app.vault.modify(file, serializeNote(finalFm, finalBody));

    const typeKey = this.getTypeKeyForPath(file.path);
    if (typeKey) this.putCache(typeKey, { file, fm: finalFm, body: finalBody });
    return file;
  }

  // When a project or area is renamed, everything that points to the old name follows the new name.
  async renameReferences(kind, oldName, newName) {
    if (!oldName || !newName || oldName === newName) return;
    const targets = kind === 'project' ? ['tasks', 'resources'] : ['projects', 'tasks', 'resources'];
    for (const key of targets) {
      const notes = (this.cache[key] || []).slice();
      for (const n of notes) {
        if (n.fm[kind] === oldName) {
          await this.updateNote(n.file, { [kind]: newName });
        }
      }
    }
  }

  // Finds a file name that is free, ignoring upper/lower case (Windows and macOS treat "A.md" and "a.md" as the same file).
  async uniquePath(folder, base, startAt) {
    const dir = this.app.vault.getAbstractFileByPath(normalizePath(folder));
    const taken = new Set();
    if (dir && dir.children) {
      for (const c of dir.children) taken.add(c.name.toLowerCase());
    }
    let i = startAt && startAt > 1 ? startAt : 1;
    for (;;) {
      const name = i === 1 ? base : base + ' (' + i + ')';
      if (!taken.has((name + '.md').toLowerCase())) {
        return normalizePath(folder + '/' + name + '.md');
      }
      i++;
    }
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
        if (n.fm.archived === true) continue; // archived items are listed once, below
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
        if (n.fm.archived === true) {
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
      const list = notes.filter(n => !n.file.basename.startsWith('PARA-Backup-')); // never copy old backups into new ones
      if (list.length === 0) continue;
      content += '## ' + key + '\n\n';
      for (const n of list) {
        content += '### ' + (n.fm.title || n.file.basename) + '\n\n';
        let text;
        try { text = await this.app.vault.read(n.file); } catch (e) { text = '(could not read)'; }
        // Use a fence that is longer than any run of backticks inside the note.
        const longest = (text.match(/`+/g) || []).reduce((m, r) => Math.max(m, r.length), 0);
        const fence = '`'.repeat(Math.max(3, longest + 1));
        content += fence + '\n' + text + '\n' + fence + '\n\n';
      }
    }
    await this.enqueueWrite(async () => {
      const folder = folders.archives || DEFAULT_FOLDERS.archives;
      if (!this.app.vault.getAbstractFileByPath(normalizePath(folder))) {
        try { await this.app.vault.createFolder(normalizePath(folder)); } catch (e) { /* exists */ }
      }
      const path = await this.uniquePath(folder, filename);
      await this.app.vault.create(path, content);
    });
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
      { folder: 'tasks', title: this.t('smp_task1'), fm: { priority: 'medium', status: 'open' } },
      { folder: 'tasks', title: this.t('smp_task2'), fm: { priority: 'high', status: 'open', due: todayISO() } },
      { folder: 'projects', title: this.t('smp_proj'), fm: { status: 'active', priority: 'high', outcome: this.t('smp_outcome') } },
      { folder: 'areas', title: this.t('smp_area'), fm: {} },
      { folder: 'resources', title: this.t('smp_res'), fm: { category: this.t('smp_cat') } },
      { folder: 'inbox', title: this.t('smp_inbox'), fm: {} },
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
      try { await this.createNote(s.folder, s.title, fm, ''); } catch (e) { console.error(e); }
    }
    new Notice(this.t('msg_sample_add'));
    this.refreshAll();
  }

  async removeSampleContent() {
    let removed = 0;
    for (const key of ['inbox', 'tasks', 'projects', 'areas', 'resources', 'archives']) {
      const notes = await this.getNotes(key);
      for (const n of notes) {
        if (n.fm.sample === true) {
          try {
            await this.app.vault.delete(n.file);
            this.dropFromCache(n.file);
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
          this.plugin.data.language = TRANSLATIONS[val] ? val : 'en';
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
            // Clean the typed name (no leading/trailing slashes, no "..") and only rebuild once typing has paused.
            const raw = (v || '').trim();
            let clean = raw ? normalizePath(raw).replace(/^\/+|\/+$/g, '') : '';
            if (!clean || clean.split('/').includes('..')) clean = DEFAULT_FOLDERS[key];
            this.plugin.data.folders[key] = clean;
            await this.plugin.saveData(this.plugin.data);
            this.plugin.scheduleRebuild();
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