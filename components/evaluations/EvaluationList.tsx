import Empty from "@/components/evaluations/empty";
// CARE Components
import CARE_p1 from "@/components/evaluations/CARE/p1";
import CARE_p2_1_HCT from "@/components/evaluations/CARE/p2_1_HCT";
import CARE_p2_2_PT from "@/components/evaluations/CARE/p2_2_PT";
import CARE_p3_1_Discuss from "@/components/evaluations/CARE/p3_1_Discuss";
import CARE_p3_3 from "@/components/evaluations/CARE/p3_3";
import CARE_p4 from "@/components/evaluations/CARE/p4";
import CARE_p5 from "@/components/evaluations/CARE/p5";
import CARE_p6 from "@/components/evaluations/CARE/p6";
import CARE_p7 from "@/components/evaluations/CARE/p7";
import CARE_p8 from "@/components/evaluations/CARE/p8";
import CARE_p9 from "@/components/evaluations/CARE/p9";
import CARE_p10 from "@/components/evaluations/CARE/p10";

import CARE_pm5 from "@/components/evaluations/CARE/pm5";
import CARE_drug1 from "@/components/evaluations/CARE/drug_1";
import CARE_drug2 from "@/components/evaluations/CARE/drug_2";
import CARE_drug3 from "@/components/evaluations/CARE/drug_3";
import CARE_drug4 from "@/components/evaluations/CARE/drug_4";
import CARE_drug5 from "@/components/evaluations/CARE/drug_5";

import CARE_manager1 from "@/components/evaluations/CARE/manager1";
import CARE_manager2 from "@/components/evaluations/CARE/manager2";
import CARE_manager3 from "@/components/evaluations/CARE/manager3";
import CARE_manager4 from "@/components/evaluations/CARE/manager4";
// SCI Components
import SCI_p1 from "@/components/evaluations/SCI/p1";
import SCI_p2_2 from "@/components/evaluations/SCI/p2_2";
import SCI_p2_3 from "@/components/evaluations/SCI/p2_3";
import SCI_p2_5 from "@/components/evaluations/SCI/p2_5";
import SCI_p2_4 from "@/components/evaluations/SCI/p2_4";
import SCI_p2_8 from "@/components/evaluations/SCI/p2_8";
import SCI_p2_10 from "@/components/evaluations/SCI/p2_10";
import SCI_p3 from "@/components/evaluations/SCI/p3";

//Social_care Components
import CARE_ssj1 from "@/components/evaluations/SCC/ssj1";
import CARE_ssj2 from "@/components/evaluations/SCC/ssj2";
import SSC_p1 from "@/components/evaluations/SCC/p1";
import SSC_p2 from "@/components/evaluations/SCC/p2";
import SSC_p1_1 from "@/components/evaluations/SCC/p1_1";
import SSC_p2_1 from "@/components/evaluations/SCC/p2_1";
import SSC_p3 from "@/components/evaluations/SCC/p3";
import SSC_p4 from "@/components/evaluations/SCC/p4";
import SSC_p5 from "@/components/evaluations/SCC/p5";



export default function EvaluationList(props: any) {
  const { subtype } = props;
  console.log("Rendering CARE_p1 for subtype:", subtype);
  if (subtype === "1" || subtype === "2") {
    return <CARE_p1 {...props} />;
  } else if (subtype === "3") {
    return <CARE_p2_1_HCT {...props} />;
  } else if (subtype === "4") {
    return <CARE_p2_2_PT {...props} />;
  } else if (subtype === "5" || subtype === "6" || subtype === "7") {
    return <CARE_p3_1_Discuss {...props} />;
  } else if (subtype === "8") {
    return <CARE_p3_3 {...props} />;
  } else if (subtype === "9") {
    return <CARE_p4 {...props} />;
  } else if (subtype === "10") {
    return <CARE_p5 {...props} />;
  } else if (subtype === "13") {
    return <CARE_p6 {...props} />;
  } else if (subtype === "14") {
    return <CARE_p7 {...props} />;
  } else if (subtype === "11") {
    return <CARE_p9 {...props} />;
  } else if (subtype === "12") {
    return <CARE_p10 {...props} />;
  } else if (subtype === "15") {
    return <CARE_p8 {...props} />;
  } else if (subtype === "17" || subtype === "52") {
    return <CARE_drug2 {...props} />;
  } else if (subtype === "18" || subtype === "51") {
    return <CARE_drug1 {...props} />;
  } else if (subtype === "19") {
    return <CARE_drug3 {...props} />;
  } else if (subtype === "20") {
    return <CARE_drug4 {...props} />;
  } else if (subtype === "21") {
    return <CARE_drug5 {...props} />;
  } else if (subtype === "22") {
    return <CARE_pm5 {...props} />;
  } else if (subtype === "23" || subtype === "39") {
    return <CARE_ssj1 {...props} />;
  } else if (subtype === "24" || subtype === "50") {
    return <CARE_ssj2 {...props} />;
  } else if (subtype === "25" || subtype === "53") {
    return <CARE_manager1 {...props} />;
  }  else if (subtype === "26" || subtype === "54" || subtype === "55") {
    return <CARE_manager2 {...props} />;
  }  else if (subtype === "27") {
    return <CARE_manager3 {...props} />;
  } else if (subtype === "28") {
    return <CARE_manager4 {...props} />;
  } else if (subtype === "29") {
    return <SCI_p1 {...props} />;
  } else if (subtype === "30") {
    return <SCI_p2_2 {...props} />;
  } else if (subtype === "31") {
    return <SCI_p2_3 {...props} />;
  } else if (subtype === "32") {
    return <SCI_p2_5 {...props} />;
  } else if (subtype === "33") {
    return <SCI_p2_8 {...props} />;
  } else if (subtype === "34") {
    return <SCI_p3 {...props} />;
  } else if (subtype === "35") {
    return <SCI_p2_4 {...props} />;
  } else if (subtype === "36") {
    return <SCI_p2_10 {...props} />;
  } else if (subtype === "37") {
    return <SSC_p1 {...props} />;
  } else if (subtype === "38") {
    return <SSC_p2 {...props} />;
  } else if (subtype === "40" || subtype ==="41") {
    return <SSC_p1_1 {...props} />;
  } else if (subtype === "42" || subtype === "43") {
    return <SSC_p2_1 {...props} />;
  } else if (subtype === "44"){
    return <SSC_p3 {...props} />;
  } else if (subtype === "46") {
    return <SSC_p4 {...props} />;
  } else if (subtype === "48") {
    return <SSC_p5 {...props} />;
  }



  return <Empty {...props} />;
}
