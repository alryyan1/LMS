import * as React from "react";

import { cn } from "/src/lib/utils";
import { Button } from "/src/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "/src/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "/src/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AddNewEmployee() {
  const [date, setDate] = React.useState(new Date());

  return (
    <div className="rtl text-right" style={{ direction: "rtl" }}>
      <div className="flex items-center justify-center flex-col rtl text-right">
        <Card className=" w-full xl:w-[1200px] mt-10">
          <CardHeader>
            <CardTitle>إنشاء حساب موظف جديد</CardTitle>
            <CardDescription>الرجاء ادخال بيانات الموظف</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4 rtl text-right">
                {/* First row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4 rtl">
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="الرجاء ادخال اسم الموظف"
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-righ mx-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="الرجاء ادخال رقم هاتف الموظف"
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right ">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="الرجاء ادخال بريد الموظف"
                      className="text-right"
                    />
                  </div>
                </div>
                {/* second row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="gender">جنس الموظف</Label>
                    <Select name="gender">
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="جنس الموظف" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="age">عمر الموظف</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="الرجاء  إدخال عمر الموظف"
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right ">
                    <Label htmlFor="salary">المرتب</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      placeholder="الرجاء إدخال مرتب الموظف"
                      className="text-right"
                    />
                  </div>
                </div>
                {/* Third row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="is_manager">هل هو مدير</Label>
                    <Select name="is_manager">
                      <SelectTrigger id="is_manager">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">لا</SelectItem>
                        <SelectItem value="1">نعم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="department_id"> القسم</Label>
                    <Select name="department_id">
                      <SelectTrigger id="department_id">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">الاطباء</SelectItem>
                        <SelectItem value="1">شؤون الافراد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="job_position"> الوظيفة</Label>
                    <Input
                      id="job_position"
                      name="job_position"
                      placeholder="الرجاء ادخال المسى الوظيفي"
                      className="text-right"
                    />
                  </div>
                </div>
                {/* fourth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="date_of_birth"> تاريخ العقد الأولى</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          name="date_of_birth"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="place_of_birth">مكان الميلاد</Label>
                    <Input
                      id="place_of_birth"
                      name="place_of_birth"
                      placeholder="الرجاء تحديد مكان الميلاد "
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="manager_id">المدير المباشر</Label>
                    <Select name="manager_id">
                      <SelectTrigger id="manager_id">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">المدير رقم1</SelectItem>
                        <SelectItem value="1"> المدير رقم 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* fifth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="resume"> السيرة الذاتية</Label>
                    <Input id="resume" name="resume" type="file" />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="image"> صورةالموظف الشخصية</Label>
                    <Input id="image" name="image" type="file" />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="address"> العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="الرجاء ادخال عنوان الموظف "
                      className="text-right"
                    />
                  </div>
                </div>
                {/* sixth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select name="language">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">اللغة العربية</SelectItem>
                        <SelectItem value="1">اللغة الانجليزية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="home_work_distance">
                      {" "}
                      المسافة من المنزل إلى العمل
                    </Label>
                    <Input
                      id="home_work_distance"
                      name="home_work_distance"
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="marital_status">الحالة الاجتماعية</Label>
                    <Select name="marital_status">
                      <SelectTrigger id="marital_status">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">متزوج </SelectItem>
                        <SelectItem value="1"> عازب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* seveth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="number_of_children">عدد الأطفال</Label>
                    <Input
                      id="number_of_children"
                      name="number_of_children"
                      type="number"
                      placeholder="الرجاء ادخال عدد الأطفال اذا وجد "
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-righ mx-2">
                    <Label htmlFor="emergency_contact_number">
                      رقم تواصل للطوارئ
                    </Label>
                    <Input
                      id="emergency_contact_number"
                      name="emergency_contact_number"
                      type="tel"
                      placeholder="الرجاء ادخال رقم هاتف للتواصل اثناء حدوث امر طارئ"
                      className="text-right"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-righ mx-2">
                    <Label htmlFor="emergency_contact_name">
                      اسم تواصل للطوارئ
                    </Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      type="tel"
                      placeholder="الرجاء ادخال اسم للتواصل اثناء حدوث امر طارئ"
                      className="text-right"
                    />
                  </div>
                </div>
                {/* ninth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="nationality">الجنسية</Label>
                    <Select name="nationality">
                      <SelectTrigger id="nationality">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">العمانية</SelectItem>
                        <SelectItem value="1">السودانية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="gov_id">رقم الهوية</Label>
                    <Input id="gov_id" name="gov_id" className="text-right" />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="passport_no">رقم الجواز</Label>
                    <Input
                      id="passport_no"
                      name="passport_no"
                      className="text-right"
                    />
                  </div>
                </div>
                {/* eighth row with two fields */}
                <div className="flex w-full space-x-reverse space-x-4">
                  <div className="flex flex-col w-1/2 space-y-1.5">
                    <Label htmlFor="first_contract"> تاريخ الميلاد </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="non_resident">الاقامة </Label>
                    <Select name="non_resident">
                      <SelectTrigger id="non_resident">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">مواطن</SelectItem>
                        <SelectItem value="1"> وافد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-1/2 space-y-1.5 text-right mx-2">
                    <Label htmlFor="user_id">حساب المستخدم</Label>
                    <Select name="user_id">
                      <SelectTrigger id="user_id">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">الحساب رقم 1</SelectItem>
                        <SelectItem value="1">الحساب رقم 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>حفظ</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef(function ListItem(
  { className, title, children, ...props },
  ref
) {
  return (
    <li>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </li>
  );
});

ListItem.displayName = "ListItem";
