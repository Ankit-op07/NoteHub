"use client";
import NotesForm from "@/components/upload/notes-form";
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
    <div className="max-w-md mx-auto flex justify-center ">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Student Information</h2> */}
      <Card className="w-[400px]">
        <CardContent>
          <NotesForm />
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button> */}
          {/* <Button>Continue</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
