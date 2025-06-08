"use client";
import { StudentForm } from "@/components/student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Page() {
  const handleSubmit = (values) => {
    console.log("Form values:", values);
    // Handle form submission here
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Student Information</h2> */}
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>Please enter your student information.</CardDescription>
      </CardHeader>
      <CardContent>
      <StudentForm onSubmit={handleSubmit} />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="outline">Cancel</Button> */}
        {/* <Button>Continue</Button> */}
      </CardFooter>
    </Card>
    </div>
  );
}