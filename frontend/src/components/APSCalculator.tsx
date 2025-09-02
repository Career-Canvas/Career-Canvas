import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CheckCircle2 } from "lucide-react";

interface APSCalculatorProps {
  onAPSCalculated: (apsScore: number, subjects: string[]) => void;
}

const APSCalculator = ({ onAPSCalculated }: APSCalculatorProps) => {
  const [subjects, setSubjects] = useState<Array<{ name: string; percentage: string }>>([
    { name: "", percentage: "" },
    { name: "", percentage: "" },
    { name: "", percentage: "" },
    { name: "", percentage: "" },
    { name: "", percentage: "" },
    { name: "", percentage: "" },
    { name: "", percentage: "" },
  ]);
  const [apsScore, setApsScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const commonSubjects = [
    "Mathematics", "Physical Science", "Life Sciences", "English",
    "Afrikaans", "Accounting", "Business Studies", "History",
    "Geography", "Economics", "Information Technology", "Art",
    "Music", "Drama", "Agricultural Science"
  ];

  const convertPercentageToPoints = (percentage: number): number => {
    if (percentage >= 80) return 8;
    if (percentage >= 70) return 7;
    if (percentage >= 60) return 6;
    if (percentage >= 50) return 5;
    if (percentage >= 40) return 4;
    if (percentage >= 30) return 3;
    if (percentage >= 20) return 2;
    return 1;
  };

  const handleSubjectChange = (index: number, field: "name" | "percentage", value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const calculateAPS = () => {
    const validSubjects = subjects.filter(s => s.name && s.percentage);
    if (validSubjects.length < 6) {
      alert("Please fill in at least 6 subjects with valid percentages.");
      return;
    }

    const totalPoints = validSubjects.reduce((sum, subject) => {
      const percentage = parseInt(subject.percentage);
      return sum + convertPercentageToPoints(percentage);
    }, 0);

    const subjectNames = validSubjects.map(s => s.name);
    setApsScore(totalPoints);
    setShowResult(true);
    onAPSCalculated(totalPoints, subjectNames);
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader className="bg-gradient-card rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-academic-blue">
          <Calculator className="w-6 h-6" />
          APS Score Calculator
        </CardTitle>
        <CardDescription>
          Enter your matric subject results to calculate your Admission Point Score
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {subjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor={`subject-${index}`}>Subject {index + 1}</Label>
                <select
                  id={`subject-${index}`}
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="">Select a subject</option>
                  {commonSubjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`percentage-${index}`}>Percentage</Label>
                <Input
                  id={`percentage-${index}`}
                  type="number"
                  min="0"
                  max="100"
                  value={subject.percentage}
                  onChange={(e) => handleSubjectChange(index, "percentage", e.target.value)}
                  placeholder="e.g. 85"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={calculateAPS}
          className="w-full mt-6 bg-academic-blue hover:bg-academic-blue/90 text-white shadow-button transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate APS Score
        </Button>

        {showResult && apsScore !== null && (
          <div className="mt-6 p-6 bg-success-green-light border border-success-green/20 rounded-lg">
            <div className="flex items-center gap-2 text-success-green mb-2">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Your APS Score</h3>
            </div>
            <div className="text-3xl font-bold text-success-green mb-2">{apsScore} points</div>
            <p className="text-sm text-gray-600">
              This score will be used to match you with suitable university courses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APSCalculator;