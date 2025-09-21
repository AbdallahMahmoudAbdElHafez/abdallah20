import { useParams } from "react-router-dom";
import SupplierStatement from "../components/SupplierStatement";

export default function SupplierStatementPage() {
  const { supplierId } = useParams();
  return (
    <div className="container mx-auto mt-8">
      <SupplierStatement supplierId={supplierId} />
    </div>
  );
}
