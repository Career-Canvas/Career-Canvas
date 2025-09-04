import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface Subject {
  name: string;
  percentage: string;
}

interface APSResult {
  wits: number | null;
  uj: number | null;
  up: number | null;
}

interface APSCalculatorProps {
  onAPSCalculated: (scores: APSResult, subjects: string[]) => void;
}

const APSCalculator = ({ onAPSCalculated }: APSCalculatorProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", percentage: "" }, // Maths / Maths Lit
    { name: "Life Orientation", percentage: "" }, // Life Orientation
    { name: "", percentage: "" }, // Home Language
    { name: "", percentage: "" }, // First Additional Language
    { name: "", percentage: "" }, // Other Subject 1
    { name: "", percentage: "" }, // Other Subject 2
    { name: "", percentage: "" }, // Other Subject 3
  ]);
  const [apsResults, setApsResults] = useState<APSResult>({ wits: null, uj: null, up: null });
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const homeLanguages = useMemo(() => [
    "English Home Language", "Afrikaans Home Language", "IsiZulu Home Language", "IsiXhosa Home Language",
    "Sepedi Home Language", "Sesotho Home Language", "Setswana Home Language", "Siswati Home Language",
    "Tshivenda Home Language", "Xitsonga Home Language", "Ndebele Home Language"
  ], []);

  const firstAdditionalLanguages = useMemo(() => [
    "English First Additional Language", "Afrikaans First Additional Language", "IsiZulu First Additional Language",
    "IsiXhosa First Additional Language", "Sepedi First Additional Language", "Sesotho First Additional Language",
    "Setswana First Additional Language", "Siswati First Additional Language",
    "Tshivenda First Additional Language", "Xitsonga First Additional Language", "Ndebele First Additional Language"
  ], []);

  const otherSubjects = useMemo(() => [
    "Accounting", "Agricultural Science", "AP English", "AP Mathematics", "Business Studies",
    "Computer Applications Technology", "Consumer Studies", "Dramatic Arts", "Economics",
    "Engineering Graphics and Design", "Geography", "History", "Information Technology",
    "Life Sciences", "Music", "Physical Science", "Religion Studies", "Tourism", "Visual Arts"
  ], []);

  const pointsScale = (percentage: number): number => {
    const p = parseInt(percentage.toString());
    if (p >= 80) return 7;
    if (p >= 70) return 6;
    if (p >= 60) return 5;
    if (p >= 50) return 4;
    if (p >= 40) return 3;
    if (p >= 30) return 2;
    return 1;
  };
  
  const witsPointsScale = (subjectName: string, percentage: number): number => {
    const p = parseInt(percentage.toString());
    if (subjectName.includes("English") || subjectName.includes("Mathematics")) {
        if (p >= 90) return 10;
        if (p >= 80) return 9;
        if (p >= 70) return 8;
        if (p >= 60) return 7;
        if (p >= 50) return 4;
        if (p >= 40) return 3;
        return 0;
    } else if (subjectName === "Life Orientation") {
        if (p >= 90) return 4;
        if (p >= 80) return 3;
        if (p >= 70) return 2;
        if (p >= 60) return 1;
        return 0;
    } else {
        if (p >= 90) return 8;
        if (p >= 80) return 7;
        if (p >= 70) return 6;
        if (p >= 60) return 5;
        if (p >= 50) return 4;
        if (p >= 40) return 3;
        return 0;
    }
  };

  const calculateWitsAPS = (validSubjects: Subject[]): number => {
    const subjectPoints = validSubjects.map(s => ({
      ...s,
      points: witsPointsScale(s.name, parseInt(s.percentage))
    }));
    subjectPoints.sort((a, b) => b.points - a.points);
    const top7Subjects = subjectPoints.slice(0, 7);
    return top7Subjects.reduce((sum, s) => sum + s.points, 0);
  };

  const calculateUJUP_APS = (validSubjects: Subject[]): number => {
    const otherSubjects = validSubjects.filter(s => s.name !== "Life Orientation");
    const subjectPoints = otherSubjects.map(s => ({
      ...s,
      points: pointsScale(parseInt(s.percentage))
    }));
    subjectPoints.sort((a, b) => b.points - a.points);
    const top6Subjects = subjectPoints.slice(0, 6);
    return top6Subjects.reduce((sum, s) => sum + s.points, 0);
  };

  const handleSubjectChange = (index: number, field: "name" | "percentage", value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
    setErrorMessage("");
  };

  const calculateAllAPS = () => {
    const validSubjects = subjects.filter(s => s.name && s.percentage && !isNaN(parseInt(s.percentage)));

    if (validSubjects.length < 7) {
      setErrorMessage("Please fill in all 7 subjects with valid percentages.");
      setShowResult(false);
      return;
    }

    const witsScore = calculateWitsAPS(validSubjects);
    const ujScore = calculateUJUP_APS(validSubjects);
    const upScore = calculateUJUP_APS(validSubjects); 

    setApsResults({ wits: witsScore, uj: ujScore, up: upScore });
    setShowResult(true);
    setErrorMessage("");
    
    // Call the callback with the Wits score and selected subjects
    const selectedSubjectNames = validSubjects.map(s => s.name);
    onAPSCalculated({ wits: witsScore, uj: ujScore, up: upScore }, selectedSubjectNames);
  };

  return (

    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus,
        select:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
            -webkit-text-fill-color: #000 !important;
            background-color: #fff !important;
            caret-color: #000 !important;
        }
      `}</style>
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl p-6">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Calculator className="w-8 h-8" />
            APS Score Calculator
          </CardTitle>
          <CardDescription className="text-gray-300 dark:text-gray-400">
            Enter your matric subject results to calculate your Admission Point Score for top universities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            
            {/* Maths / Maths Lit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-sm">
              <div>
                <Label htmlFor="subject-0" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject 1 (Maths/Maths-Lit)</Label>
                                  <select
                    id="subject-0"
                    value={subjects[0].name}
                    onChange={(e) => handleSubjectChange(0, "name", e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Select an option</option>
                    <option value="Mathematics" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Mathematics</option>
                    <option value="Mathematical Literacy" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Mathematical Literacy</option>
                  </select>
              </div>
              <div>
                <Label htmlFor="percentage-0" className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</Label>
                                 <Input
                   id="percentage-0"
                   type="number"
                   min="0"
                   max="100"
                   value={subjects[0].percentage}
                   onChange={(e) => handleSubjectChange(0, "percentage", e.target.value)}
                   placeholder="e.g. 85"
                   className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                 />
              </div>
            </div>

            {/* Life Orientation (fixed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-sm">
              <div>
                <Label htmlFor="subject-1" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject 2 (Life Orientation)</Label>
                <select
                  id="subject-1"
                  value={subjects[1].name}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                  disabled
                >
                  <option value="Life Orientation" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Life Orientation</option>
                </select>
              </div>

              <div>
                <Label htmlFor="percentage-1" className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</Label>
                                 <Input
                   id="percentage-1"
                   type="number"
                   min="0"
                   max="100"
                   value={subjects[1].percentage}
                   onChange={(e) => handleSubjectChange(1, "percentage", e.target.value)}
                   placeholder="e.g. 85"
                   className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                 />
              </div>
            </div>
            
            {/* Home Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-sm">
              <div>
                <Label htmlFor="subject-2" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject 3 (Home Language)</Label>
                <select

                  id="subject-2"
                  value={subjects[2].name}
                  onChange={(e) => handleSubjectChange(2, "name", e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"

                >
                  <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Select an option</option>
                  {homeLanguages.map((subj) => (
                    <option key={subj} value={subj} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="percentage-2" className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</Label>
                                 <Input
                   id="percentage-2"
                   type="number"
                   min="0"
                   max="100"
                   value={subjects[2].percentage}
                   onChange={(e) => handleSubjectChange(2, "percentage", e.target.value)}
                   placeholder="e.g. 85"

                   className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"

                 />
              </div>
            </div>

            {/* First Additional Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-sm">
              <div>
                <Label htmlFor="subject-3" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject 4 (First Additional Language)</Label>
                <select
                  id="subject-3"
                  value={subjects[3].name}
                  onChange={(e) => handleSubjectChange(3, "name", e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                >
                  <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Select an option</option>
                  {firstAdditionalLanguages.map((subj) => (
                    <option key={subj} value={subj} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="percentage-3" className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</Label>
                                 <Input
                   id="percentage-3"
                   type="number"
                   min="0"
                   max="100"
                   value={subjects[3].percentage}
                   onChange={(e) => handleSubjectChange(3, "percentage", e.target.value)}
                   placeholder="e.g. 85"
                   className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                 />
              </div>
            </div>

            {/* Other Subjects */}
            {[4, 5, 6].map((index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg shadow-sm">
                <div>
                  <Label htmlFor={`subject-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject {index + 1} (Other)</Label>
                  <select
                    id={`subject-${index}`}
                    value={subjects[index].name}
                    onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Select a subject</option>
                    {otherSubjects.map((subj) => (
                      <option key={subj} value={subj} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{subj}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor={`percentage-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</Label>
                                     <Input
                     id={`percentage-${index}`}
                     type="number"
                     min="0"
                     max="100"
                     value={subjects[index].percentage}
                     onChange={(e) => handleSubjectChange(index, "percentage", e.target.value)}
                     placeholder="e.g. 85"
                     className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                   />
                </div>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}

          <Button 
            onClick={calculateAllAPS}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 rounded-full"
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate All APS Scores
          </Button>

          {showResult && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {apsResults.wits !== null && (
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Wits APS</h3>
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">{apsResults.wits}</div>
                </div>
              )}
              {apsResults.uj !== null && (
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">UJ APS</h3>
                  <div className="text-4xl font-bold text-red-600">{apsResults.uj}</div>
                </div>
              )}
              {apsResults.up !== null && (
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">UP APS</h3>
                  <div className="text-4xl font-bold text-green-600">{apsResults.up}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default APSCalculator;
