import React, { useState, useEffect } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { Link } from "react-router-dom";
import WatchGrid from "../../components/watch/WatchGrid";
import { FiArrowRight, FiSearch, FiShoppingCart, FiCheck } from "react-icons/fi";
import Spinner from "../../components/common/Spinner";
import { watches as mockWatches } from "../../data/watches";
import useCart from "../../hooks/useCart";

/* CATEGORY IMAGES */
import luxuryImg from "../../assets/luxury.png";
import sportsImg from "../../assets/sports.png";
import vintageImg from "../../assets/vintage.png";

/* BRAND IMAGES */
import rolexImg from "../../assets/rl.png";
import omegaImg from "../../assets/o1.png";
import patekImg from "../../assets/pp1.png";
import audemarsImg from "../../assets/ap1.png";

/* ===========================
   BRAND CARD
=========================== */
const BrandCard = ({ brand, tagline, img, onSelected }) => {
  return (
    <div
      className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-gray-800 hover:border-gray-500 transition-all duration-700"
      onClick={() => onSelected(brand)}
    >
      <img
        src={img}
        alt={brand}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-3xl font-bold text-white mb-2">{brand}</h3>
        <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {tagline}
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          View Models <FiArrowRight />
        </div>
      </div>
    </div>
  );
};

/* ===========================
   WATCH CARD
=========================== */
const FeaturedWatchCard = ({ watch }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(watch);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 flex flex-col group">
      <div className="h-64 overflow-hidden relative">
        <img
          src={watch.image}
          alt={watch.model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
          {watch.brand}
        </div>

        <h4 className="text-lg font-bold text-white mb-2">
          {watch.model}
        </h4>

        <p className="text-zinc-400 font-semibold mb-4">
          ${watch.price.toLocaleString()}
        </p>

        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${
            added
              ? "bg-green-600 text-white"
              : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          {added ? (
            <>
              <FiCheck /> Added
            </>
          ) : (
            <>
              <FiShoppingCart /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ===========================
   HOME PAGE
=========================== */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFeatured(mockWatches.slice(0, 8));
    setLoading(false);
  }, []);

  const featuredBrands = [
    { name: "Rolex", tagline: "The crown of achievement.", img: rolexImg },
    { name: "Omega", tagline: "Exacting standards since 1848.", img: omegaImg },
    { name: "Patek Philippe", tagline: "Begin your own tradition.", img: patekImg },
    { name: "Audemars Piguet", tagline: "To break the rules, you must first master them.", img: audemarsImg },
  ];

  const displayedWatches = mockWatches.filter((watch) => {
    if (selectedBrand && watch.brand !== selectedBrand) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !watch.brand.toLowerCase().includes(q) &&
        !watch.model.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <PageWrapper className="py-0 max-w-none bg-white">

      {/* HERO SECTION */}
      <section className="bg-black text-white py-40 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6">
            Timeless Craftsmanship
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Discover iconic timepieces engineered for precision and built to last generations.
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* FEATURED WATCHES */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-14">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">
                Featured Watches
              </h2>
              <p className="text-gray-500 mt-3">
                Curated selections from our premium collection.
              </p>
            </div>

            <Link
              to="/catalog"
              className="text-sm font-semibold tracking-wide text-black hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <WatchGrid watches={featured} />
          )}
        </div>
      </section>

      {/* FEATURED BRANDS */}
      <section className="bg-zinc-950 py-32 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-4">
              Heritage & Prestige
            </h2>
            <h3 className="text-5xl font-bold text-white">
              Featured Luxury Brands
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand, idx) => (
              <BrandCard
                key={idx}
                brand={brand.name}
                tagline={brand.tagline}
                img={brand.img}
                onSelected={setSelectedBrand}
              />
            ))}
          </div>

          {selectedBrand && (
            <div className="mt-24 pt-16 border-t border-zinc-800">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-bold text-white">
                  {selectedBrand} Collection
                </h3>

                <div className="relative w-72">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full py-3 pl-12 pr-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedWatches.map((watch) => (
                  <FeaturedWatchCard key={watch.id} watch={watch} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="bg-gray-100 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-3">
              Explore collections tailored to your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/catalog?category=luxury"
              className="group relative h-80 rounded-2xl overflow-hidden block"
            >
              <img
                src={luxuryImg}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                Luxury
              </div>
            </Link>

            <Link
              to="/catalog?category=sports"
              className="group relative h-80 rounded-2xl overflow-hidden block"
            >
              <img
                src={sportsImg}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Sports"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                Sports & Activity
              </div>
            </Link>

            <Link
              to="/catalog?category=vintage"
              className="group relative h-80 rounded-2xl overflow-hidden block"
            >
              <img
                src={vintageImg}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Vintage"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                Vintage
              </div>
            </Link>
          </div>
        </div>
      </section>

    </PageWrapper>
  );
}