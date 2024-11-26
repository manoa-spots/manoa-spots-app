export default function Home() {
  return (
    <main>
      <div id="landing-page">
        {/* Hero Section */}
        <div className="landing-hero text-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <h1 style={{ fontSize: '36pt', fontWeight: '600', color: '#343a40' }}>
            Find your perfect spot!
          </h1>
        </div>

        {/* Trending Spots Section */}
        <div className="landing-white-background py-5" style={{ backgroundColor: 'white' }}>
          <div className="container text-center">
            <h2 className="trending mb-4" style={{ fontWeight: '500', fontSize: '28pt' }}>
              Trending Spots
            </h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {/* Placeholder cards */}
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Spot 1</h5>
                    <p className="card-text">Description for Spot 1.</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Spot 2</h5>
                    <p className="card-text">Description for Spot 2.</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Spot 3</h5>
                    <p className="card-text">Description for Spot 3.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
