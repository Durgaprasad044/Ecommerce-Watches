import RevenueChart from "../../components/vendor/RevenueChart";

export default function Analytics(){
  return(
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <RevenueChart />
    </DashboardLayout>
  )
}