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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "/src/components/ui/navigation-menu";
import NewNavbar from "../../NewNavbar";

export default function PaymentSuppliers() {
  return (
    <div className=" rtl text-right">
      <div className="flex items-center justify-center flex-col text-right">
        <Card className="w-[450px] mt-10">
          <CardHeader>
            <CardTitle>سداد فواتير المورد</CardTitle>
            <CardDescription>
              الرجاء ادخال قمية السداد واختيار طرق السداد
            </CardDescription>
            <CardDescription>
              قيمة المطالبة: {/* Fetch amount from DB */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input type="hidden" name="supplier_id" />
              <Input type="hidden" name="user_id" />
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="amount">قيمة السداد</Label>
                  <Input
                    id="amount"
                    name="amount"
                    placeholder="الرجاء ادخال قمية السداد"
                    className="text-right"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">طريقة الدفع</Label>
                  <Select name="type_of_payment">
                    <SelectTrigger id="type_of_payment">
                      <SelectValue placeholder="اختر طريقة السداد" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="cash">كاش</SelectItem>
                      <SelectItem value="bank">البنك</SelectItem>
                      <SelectItem value="visa">بطاقة الصراف</SelectItem>
                      <SelectItem value="mobile_transfer">
                        تحويل عن طريق الموبايل
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">الغاء</Button>
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
