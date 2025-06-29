import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create Your CollegeBuddy Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@college.edu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  placeholder="Enter your college name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major/Department</Label>
                <Input id="major" placeholder="Your field of study" required />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Create Account
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
