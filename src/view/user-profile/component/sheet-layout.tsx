import { useState } from "react";
import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ISheetContentLayoutProps {
  title: string;
  content: React.ReactNode;
  isEdit: boolean;
  setIsEdit: (open: boolean) => void;
  className?: string;
}

export default function SheetContentLayout({
  title,
  content,
  className,
  setIsEdit,
}: ISheetContentLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsEdit(false);
      }}
    >
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsEdit(false);
          }}
          variant="ghost"
          className="h-8 hover:!bg-white flex flex-row w-full justify-start items-center !px-1.5 !py-2 mx-0.5"
        >
          <User className="text-gray-500" />
          <span className="font-normal">Account</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        isHidden
        className="w-full overflow-auto rounded-l-2xl border-0 sm:max-w-[508px]"
      >
        <SheetHeader className="h-[70px] w-full flex-row justify-between !border-black bg-black">
          <SheetTitle className="flex items-center pl-6 text-[18px] text-white capitalize">
            {title}
          </SheetTitle>
          <SheetDescription></SheetDescription>
          <Button
            className="bg-accent-foreground p-[9px] hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} className="text-white"></X>
          </Button>
        </SheetHeader>
        <div className={cn("w-full py-[15px]", className)}>{content}</div>
      </SheetContent>
    </Sheet>
  );
}
