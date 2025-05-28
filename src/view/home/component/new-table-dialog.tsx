import { Icons } from "@/assets";
import { Button } from "@/components/ui/button";

export default function CreateTable() {
  return (
    <Button className="w-full flex items-center justify-start space-x-3 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-150 text-gray-700">
      <div className="flex items-center justify-center w-6 h-6">
        <Icons.plus />
      </div>
      <span className="text-sm font-medium">Tạo Bảng</span>
    </Button>
  );
}
