"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 1500);
  };

  const handleUpdatePassword = () => {
    setPasswordUpdated(true);
    setTimeout(() => setPasswordUpdated(false), 1500);
  };

  const handleSavePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 1500);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Settings</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Update Profile
            </CardTitle>
            <span
              className={`text-sm text-green-600 font-medium transition-all duration-300 ${
                profileSaved ? "opacity-100 scale-110" : "opacity-0 scale-75"
              }`}
            >
              Saved
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-700">Name</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
                <User className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="flex-1 outline-none border-none text-slate-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="flex-1 outline-none border-none text-slate-900"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" /> Change Password
            </CardTitle>
            <span
              className={`text-sm text-green-600 font-medium transition-all duration-300 ${
                passwordUpdated ? "opacity-100 scale-110" : "opacity-0 scale-75"
              }`}
            >
              Updated
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-700">
                Current Password
              </label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="********"
                  className="flex-1 outline-none border-none text-slate-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-700">New Password</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="********"
                  className="flex-1 outline-none border-none text-slate-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-700">
                Confirm New Password
              </label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="********"
                  className="flex-1 outline-none border-none text-slate-900"
                />
              </div>
            </div>

            <Button
              onClick={handleUpdatePassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Notifications Card */}
      <Card className="shadow-lg rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-300 max-w-2xl group">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Notifications &
            Preferences
          </CardTitle>
          <span
            className={`text-sm text-green-600 font-medium transition-all duration-300 ${
              prefsSaved ? "opacity-100 scale-110" : "opacity-0 scale-75"
            }`}
          >
            Saved
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-medium">
              Email Notifications
            </span>
            <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-medium">SMS Alerts</span>
            <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
          </div>
          <Button
            onClick={handleSavePrefs}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5"
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
