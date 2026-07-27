// Correo semanal de clases de orientación para profesores jefes.
// Módulo puro (sin React) para poder previsualizarlo y probarlo aparte de la UI.

const normalize = (value: string) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const escapeEmailHtml = (value: string) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");

export type WeekEmailClass = {
  date: string;
  dayLabel: string;
  course: string;
  teacherName: string;
  time: string;
  title: string;
  action: string;
  status: string;
  notes: string;
  canvaUrl: string;
  planUrl: string;
  driveUrl: string;
};

const weekEmailStatusBadge = (status: string) => {
  const value = normalize(status);
  const tone = /realizad/.test(value) ? { bg: "#e8f5ee", fg: "#176b45" }
    : /reprogramad/.test(value) ? { bg: "#fdf3e3", fg: "#8a5a1a" }
    : /cancelad|suspendid/.test(value) ? { bg: "#fff0ed", fg: "#a63d2f" }
    : { bg: "#eaf1f3", fg: "#2c6e7f" };
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:${tone.bg};color:${tone.fg};font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;">${escapeEmailHtml(status || "Planificada")}</span>`;
};

const weekEmailMaterialLink = (url: string, label: string, bg: string, fg: string) =>
  url
    ? `<a href="${escapeEmailHtml(url)}" style="display:inline-block;margin:4px 6px 0 0;padding:6px 12px;border-radius:999px;background-color:${bg};color:${fg};font-family:Arial,sans-serif;font-size:11px;font-weight:800;text-decoration:none;">${escapeEmailHtml(label)} &rarr;</a>`
    : "";

export const orientationWeekEmailHtml = (params: {
  weekLabel: string;
  planWeek: string;
  ownerName: string;
  classes: WeekEmailClass[];
  publicUrl: string;
}) => {
  const { weekLabel, planWeek, ownerName, classes, publicUrl } = params;
  const courses = Array.from(new Set(classes.map((item) => item.course).filter(Boolean)));
  const days = Array.from(new Set(classes.map((item) => item.date)));

  const classRow = (item: WeekEmailClass, isFirst: boolean) => {
    const materials = [
      weekEmailMaterialLink(item.canvaUrl, "Presentación", "#eaf1f3", "#2c6e7f"),
      weekEmailMaterialLink(item.planUrl, "Planificación", "#f0ecf5", "#76568c"),
      weekEmailMaterialLink(item.driveUrl, "Carpeta", "#f6efe4", "#b87935"),
    ].join("");
    return `<tr><td style="padding:14px 18px;${isFirst ? "" : "border-top:1px solid #ece9e2;"}">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;"><tr>
        <td style="vertical-align:top;">
          <span style="display:inline-block;font-family:Arial,sans-serif;font-size:13px;font-weight:800;color:#152d47;">${escapeEmailHtml(item.course || "Sin curso")}</span>
          ${item.time ? `<span style="display:inline-block;margin-left:8px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#8a7660;">${escapeEmailHtml(item.time)}</span>` : ""}
          ${item.teacherName ? `<div style="margin-top:2px;font-family:Arial,sans-serif;font-size:11px;color:#8f9aa5;">Prof. jefe: ${escapeEmailHtml(item.teacherName)}</div>` : ""}
        </td>
        <td align="right" style="vertical-align:top;white-space:nowrap;">${weekEmailStatusBadge(item.status)}</td>
      </tr></table>
      <div style="margin-top:7px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.4;color:#20364b;">${escapeEmailHtml(item.title || "Clase de orientación")}</div>
      ${item.action ? `<div style="margin-top:4px;font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#76568c;">${escapeEmailHtml(item.action)}</div>` : ""}
      ${item.notes ? `<div style="margin-top:6px;font-family:Arial,sans-serif;font-size:12px;line-height:1.55;color:#66727e;">${escapeEmailHtml(item.notes)}</div>` : ""}
      ${materials ? `<div style="margin-top:8px;">${materials}</div>` : `<div style="margin-top:8px;font-family:Arial,sans-serif;font-size:11px;color:#a9b2bb;">Material por confirmar</div>`}
    </td></tr>`;
  };

  const dayCards = days
    .map((date) => {
      const dayClasses = classes.filter((item) => item.date === date);
      const dayNumber = /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(8, 10) : "·";
      const label = dayClasses[0]?.dayLabel || date;
      return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:22px;border-collapse:separate;border-spacing:0;border:1px solid #e4e1da;border-radius:14px;background-color:#ffffff;">
        <tr>
          <td style="width:54px;padding:17px 0 15px 16px;vertical-align:top;">
            <span style="display:inline-block;width:34px;height:34px;border-radius:50%;background-color:#2c6e7f;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:800;line-height:34px;text-align:center;">${escapeEmailHtml(dayNumber)}</span>
          </td>
          <td style="padding:15px 16px 13px 8px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#2c6e7f;">${dayClasses.length} ${dayClasses.length === 1 ? "clase" : "clases"}</div>
            <div style="margin-top:3px;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.25;color:#152d47;">${escapeEmailHtml(label)}</div>
          </td>
        </tr>
        <tr><td colspan="2" style="padding:0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
            ${dayClasses.map((item, index) => classRow(item, index === 0)).join("")}
          </table>
        </td></tr>
      </table>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin:0;background-color:#eeeae1;"><tr><td align="center" style="padding:28px 10px;">
  <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;background-color:#fffdf8;border-radius:18px;overflow:hidden;">
    <tr><td style="height:7px;background-color:#2c6e7f;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    <tr><td style="padding:30px 34px 26px;background-color:#132f4c;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
        <td style="vertical-align:top;">
          <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#9fd0d8;">Tiza Education &nbsp;/&nbsp; SOY+</div>
          <h1 style="margin:13px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.05;color:#ffffff;">Clases de<br>la semana</h1>
        </td>
        <td align="right" style="vertical-align:top;width:88px;">
          <img src="https://tiza-education-app.vercel.app/logo-san-lucas-transparent.png" width="78" height="78" alt="Colegio San Lucas" style="display:block;width:78px;height:78px;border:0;outline:none;text-decoration:none;" />
        </td>
      </tr></table>
      <div style="margin-top:24px;padding-top:17px;border-top:1px solid #40576e;font-family:Arial,sans-serif;font-size:12px;line-height:1.55;color:#dce4ec;">${escapeEmailHtml(weekLabel)}${planWeek ? ` &nbsp;&middot;&nbsp; ${escapeEmailHtml(planWeek)}` : ""}</div>
    </td></tr>

    <tr><td style="padding:30px 34px 8px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.45;color:#20364b;">Estimadas y estimados docentes,</div>
      <div style="margin-top:10px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#56616c;">Comparto con ustedes la planificación de las clases de Orientación de esta semana, con el material disponible para cada curso. Agradezco de antemano su apoyo para acompañar estos espacios formativos.</div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:22px;border-collapse:separate;border-spacing:0;background-color:#f4efe5;border-radius:13px;"><tr>
        <td align="center" style="padding:18px 12px;vertical-align:middle;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1;color:#2c6e7f;">${classes.length}</div>
          <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#8a7660;">${classes.length === 1 ? "Clase" : "Clases"}</div>
        </td>
        <td align="center" style="padding:18px 12px;border-left:1px solid #ddd5c7;vertical-align:middle;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1;color:#76568c;">${courses.length}</div>
          <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#8a7660;">${courses.length === 1 ? "Curso" : "Cursos"}</div>
        </td>
        <td align="center" style="padding:18px 12px;border-left:1px solid #ddd5c7;vertical-align:middle;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1;color:#b87935;">${days.length}</div>
          <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#8a7660;">${days.length === 1 ? "Día" : "Días"}</div>
        </td>
      </tr></table>

      ${dayCards}

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:24px;border-collapse:separate;border-spacing:0;background-color:#eaf1f3;border-radius:12px;"><tr><td style="padding:18px 20px;text-align:center;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.45;color:#173f50;">Todas las clases y su material están siempre disponibles en línea.</div>
        <a href="${escapeEmailHtml(publicUrl)}" style="display:inline-block;margin-top:12px;padding:10px 22px;border-radius:999px;background-color:#2c6e7f;color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:.05em;text-decoration:none;">Ver todas las clases</a>
      </td></tr></table>

      <div style="padding:25px 0 29px;font-family:Arial,sans-serif;color:#34404c;">
        <div style="font-size:13px;">Un cordial saludo,</div>
        <div style="margin-top:5px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#152d47;">${escapeEmailHtml(ownerName || "Equipo de Orientación")}</div>
        <div style="margin-top:3px;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9a7e63;">Equipo de Orientación &middot; Colegio San Lucas de Lo Espejo</div>
      </div>
    </td></tr>
    <tr><td style="padding:15px 34px;background-color:#132f4c;font-family:Arial,sans-serif;font-size:9px;line-height:1.5;letter-spacing:.1em;text-align:center;text-transform:uppercase;color:#aebdca;">Planificación semanal de orientación &nbsp;&middot;&nbsp; Generado con Tiza Education</td></tr>
  </table>
  </td></tr></table>`;
};

export const orientationWeekEmailText = (params: { weekLabel: string; planWeek: string; ownerName: string; classes: WeekEmailClass[]; publicUrl: string }) => {
  const { weekLabel, planWeek, ownerName, classes, publicUrl } = params;
  const lines: string[] = [
    `CLASES DE ORIENTACIÓN · ${weekLabel}${planWeek ? ` (${planWeek})` : ""}`,
    "",
    "Estimadas y estimados docentes:",
    "",
    "Comparto la planificación de las clases de Orientación de esta semana.",
    "",
  ];
  Array.from(new Set(classes.map((item) => item.date))).forEach((date) => {
    const dayClasses = classes.filter((item) => item.date === date);
    lines.push(`■ ${dayClasses[0]?.dayLabel || date}`);
    dayClasses.forEach((item) => {
      lines.push(`  • ${item.course}${item.time ? ` (${item.time})` : ""} — ${item.title || "Clase de orientación"}${item.action ? ` · ${item.action}` : ""}${item.status ? ` [${item.status}]` : ""}`);
      if (item.canvaUrl) lines.push(`    Presentación: ${item.canvaUrl}`);
      if (item.planUrl) lines.push(`    Planificación: ${item.planUrl}`);
      if (item.driveUrl) lines.push(`    Carpeta: ${item.driveUrl}`);
    });
    lines.push("");
  });
  lines.push(`Todas las clases están disponibles en: ${publicUrl}`, "", "Un cordial saludo,", ownerName || "Equipo de Orientación", "Equipo de Orientación · Colegio San Lucas de Lo Espejo");
  return lines.join("\n");
};
