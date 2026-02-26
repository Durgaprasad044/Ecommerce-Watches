export default function AddWatch(){
  return(
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Add New Watch</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-3xl">
        <input placeholder="Model Name" className="input" />
        <input placeholder="Price" className="input mt-4" />

        <select className="input mt-4">
          <option>Luxury</option>
          <option>Sports</option>
          <option>Vintage</option>
        </select>

        <textarea placeholder="Description" className="input mt-4" />

        <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg">
          Save Product
        </button>
      </div>
    </DashboardLayout>
  );
}