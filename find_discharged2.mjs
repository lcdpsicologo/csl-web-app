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
  
  let found = false;
  for (const s of data) {
    if (!s.pieData) continue;
    try {
      const pd = JSON.parse(s.pieData);
      if (pd.active === false) {
        console.log(`Found inactive PIE student: ${s.id} - ${s.data?.fullName || s.fullName || 'Unknown'}`);
        pd.active = true;
        pd.bajaDate = "";
        pd.notes = pd.notes ? pd.notes.replace("Alta/Egreso PIE registrada desde el software.", "") : "";
        
        const { error: updErr } = await supabase.from("app_records").update({
          pieData: JSON.stringify(pd)
        }).eq("id", s.id);
        
        if (updErr) {
          console.error("Error restoring", s.id, updErr);
        } else {
          console.log(`Successfully restored ${s.data?.fullName || s.fullName || 'Unknown'}`);
          found = true;
        }
      }
    } catch (e) {
      // skip
    }
  }
  if (!found) console.log("No inactive PIE students found.");
}

main();
