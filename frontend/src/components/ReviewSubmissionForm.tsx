import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { submitReview, filterReview, type ReviewSubmission, type FilterResult } from "@/services/reviewService";

interface ReviewSubmissionFormProps {
  universityName: string;
  onReviewSubmitted?: () => void;
}

const REVIEW_CATEGORIES = [
  "Campus Life",
  "Academics", 
  "Facilities",
  "Food",
  "Transport",
  "Technology",
  "Social Life",
  "Location",
  "Cost",
  "Research"
];

export default function ReviewSubmissionForm({ universityName, onReviewSubmitted }: ReviewSubmissionFormProps) {
  const [formData, setFormData] = useState<ReviewSubmission>({
    reviewText: "",
    universityName,
    category: "Campus Life",
    rating: 5,
    author: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof ReviewSubmission, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear previous results when form changes
    setFilterResult(null);
    setError(null);
    setSuccess(false);
  };

  const handleFilterReview = async () => {
    if (!formData.reviewText.trim()) {
      setError("Please enter a review before filtering.");
      return;
    }

    setIsFiltering(true);
    setError(null);
    setFilterResult(null);

    try {
      const result = await filterReview(formData.reviewText);
      setFilterResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter review");
    } finally {
      setIsFiltering(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.reviewText.trim() || !formData.author.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitReview(formData);
      setSuccess(true);
      setFilterResult(result.data.filterResult);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        reviewText: "",
        author: ""
      }));

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getToxicityColor = (score: number) => {
    if (score < 0.3) return "bg-green-100 text-green-800";
    if (score < 0.6) return "bg-yellow-100 text-yellow-800";
    if (score < 0.8) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Shield className="w-5 h-5" />
          Submit Your Review
        </CardTitle>
        <CardDescription>
          Share your experience at {universityName}. All reviews are automatically filtered for appropriate content.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="reviewText">Your Review *</Label>
          <Textarea
            id="reviewText"
            placeholder="Tell future students about your experience at this university..."
            value={formData.reviewText}
            onChange={(e) => handleInputChange("reviewText", e.target.value)}
            className="min-h-[100px] resize-none bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            maxLength={1000}
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Minimum 10 characters</span>
            <span>{formData.reviewText.length}/1000</span>
          </div>
        </div>

        {/* Category and Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {REVIEW_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="hover:bg-gray-50">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={formData.rating.toString()} onValueChange={(value) => handleInputChange("rating", parseInt(value))}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()} className="hover:bg-gray-50">
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Author Name */}
        <div className="space-y-2">
          <Label htmlFor="author">Your Name *</Label>
          <Input
            id="author"
            placeholder="Enter your name (will be displayed publicly)"
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            maxLength={50}
          />
        </div>

        {/* AI Filtering Section */}
        {formData.reviewText.trim().length >= 10 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">AI Content Filter</Label>
                             <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={handleFilterReview}
                 disabled={isFiltering}
                 className="text-xs"
               >
                {isFiltering ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Check Content
                  </>
                )}
              </Button>
            </div>

            {filterResult && (
              <div className={`p-3 rounded-lg border ${
                filterResult.isOffensive 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {filterResult.isOffensive ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className={`font-medium ${
                    filterResult.isOffensive ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {filterResult.isOffensive ? 'Content Flagged' : 'Content Approved'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  filterResult.isOffensive ? 'text-red-700' : 'text-green-700'
                }`}>
                  {filterResult.reason}
                </p>

                {filterResult.toxicityScores && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Toxicity Analysis:</p>
                                         <div className="grid grid-cols-2 gap-2">
                       {Object.entries(filterResult.toxicityScores).map(([category, score]) => (
                         <div key={category} className="flex justify-between items-center text-xs">
                           <span className="capitalize">{category.replace('_', ' ')}:</span>
                           <Badge variant="outline" className={getToxicityColor(score as number)}>
                             {((score as number) * 100).toFixed(1)}%
                           </Badge>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Review submitted successfully! Thank you for sharing your experience.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.reviewText.trim() || !formData.author.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Review...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>

        {/* Info Note */}
        <div className="text-xs text-gray-500 text-center">
          <Shield className="w-3 h-3 inline mr-1" />
          All reviews are automatically filtered using AI to ensure appropriate content.
        </div>
      </CardContent>
    </Card>
  );
}
