import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].replace(/["']/g, "") : null;
};

const supabase = createClient(
  getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getEnv("SUPABASE_SERVICE_ROLE_KEY")
);

async function main() {
  const { data, error } = await supabase.from("app_records").select("*");
  if (error) {
    console.error(error);
    return;
  }
  
  const discharged = data.filter(d => {
    if (!d.pieData) return false;
    try {
      const pd = JSON.parse(d.pieData);
      return pd.active === false && pd.notes && pd.notes.includes("Alta/Egreso PIE registrada desde el software.");
    } catch (e) {
      return false;
    }
  });

  if (discharged.length === 0) {
    console.log("No recently discharged students found.");
  } else {
    for (const s of discharged) {
      console.log(`Found: ${s.id} - ${s.data?.fullName || 'Unknown'}`);
      const pd = JSON.parse(s.pieData);
      pd.active = true;
      pd.bajaDate = "";
      pd.notes = pd.notes.replace("Alta/Egreso PIE registrada desde el software.", "");
      // Restore the student
      const { error: updErr } = await supabase.from("app_records").update({
        pieData: JSON.stringify(pd)
      }).eq("id", s.id);
      if (updErr) {
        console.error("Error restoring", s.id, updErr);
      } else {
        console.log(`Successfully restored ${s.data?.fullName}`);
      }
    }
  }
}

main();
