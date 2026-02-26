import DashboardLayout from "../../components/layout/DashboardLayout";
import { getVendorOrders } from "../../services/orderService";

export default function VendorOrders(){

  const [orders,setOrders] = useState([]);

  useEffect(()=>{
    getVendorOrders().then(setOrders);
  },[]);

  return(
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-xl border">
        {orders.map(o=>(
          <div key={o.id} className="p-4 border-b flex justify-between">
            <span>#{o.id}</span>
            <select>
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}