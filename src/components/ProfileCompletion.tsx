import { User, Globe, Calendar, Languages, Mail, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileCompletion = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    birthDate: "",
    nationality: "",
    languages: ""
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const countries = [
    "Brasil", "Estados Unidos", "Reino Unido", "Canadá", "Austrália",
    "França", "Alemanha", "Espanha", "Itália", "Portugal", "Argentina",
    "México", "Colômbia", "Chile", "Peru", "Outro"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(profileData).every(value => value.trim() !== "")) {
      setIsCompleted(true);
      alert(t("profileSaved"));
    } else {
      alert(t("fillRequiredFields"));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isCompleted) {
    return (
      <Card className="bg-gradient-card border-accent shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="text-accent border-accent px-4 py-2">
              <User className="h-4 w-4 mr-2" />
              {t("profileComplete")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {t("profileCompleteMessage")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="h-5 w-5" />
          {t("completeProfile")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("profileCompletionDesc")}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("name")} *</Label>
              <Input
                id="firstName"
                placeholder={t("firstNamePlaceholder")}
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("surname")} *</Label>
              <Input
                id="lastName"
                placeholder={t("lastNamePlaceholder")}
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")} *</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">{t("birthDate")} *</Label>
            <Input
              id="birthDate"
              type="date"
              value={profileData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">{t("nationality")} *</Label>
            <Select onValueChange={(value) => handleInputChange("nationality", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCountry")} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">{t("languagesSpoken")} *</Label>
            <Input
              id="languages"
              placeholder={t("languagePlaceholder")}
              value={profileData.languages}
              onChange={(e) => handleInputChange("languages", e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full">
            <User className="h-4 w-4 mr-2" />
            {t("saveProfile")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;