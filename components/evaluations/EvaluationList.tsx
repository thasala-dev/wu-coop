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
import CARE_pm5 from "@/components/evaluations/CARE/pm5";
import CARE_ssj1 from "@/components/evaluations/CARE/ssj1";
import CARE_ssj2 from "@/components/evaluations/CARE/ssj2";
// SCI Components
import SCI_p1 from "@/components/evaluations/SCI/p1";
import SCI_p2_2 from "@/components/evaluations/SCI/p2_2";
import SCI_p3 from "@/components/evaluations/SCI/p3";

export default function EvaluationList(props: any) {
  const { subtype } = props;
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
  }  else if (subtype === "22") {
    return <CARE_pm5 {...props} />;
  } else if (subtype === "23") {
    return <CARE_ssj1 {...props} />;
  } else if (subtype === "24") {
    return <CARE_ssj2 {...props} />;
  } else if (subtype === "29" || subtype === "39") {
    return <SCI_p1 {...props} />;
  } else if (subtype === "30") {
    return <SCI_p2_2 {...props} />;
  } else if (subtype === "34" || subtype === "50") {
    return <SCI_p3 {...props} />;
  }
  return <Empty {...props} />;
}
