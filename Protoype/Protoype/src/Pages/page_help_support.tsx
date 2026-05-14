import SidebarLayout from "../components/SidebarLayout";
import BrockDance from "../gif/Brock_Dancing_Meme_GREEN_SCREEN-ezgif.com-resize.gif"
import HitmontopDance from "../gif/hitmontop_v2.mp4"
export default function PageProfil() {
  return (
    <SidebarLayout title="Help & Support">
      <div className="card mt-1 shadow-sm">
        <div className="card-body ">
          <p className="mt-3">
            <strong>Contact Email:</strong> support@salondecarte.com
          </p>
          <p className="mt-3">
            <strong>Contact Phone:</strong> 1-800-273-8255  
          </p>

          
        </div>
        
      </div>

    <div className="text-center mt-4">
      <img
            src={BrockDance}
            alt="Brock Dance "
            style={{ width: "250px", borderRadius: "10px" }}
            className="align-self-center"
          />

          <video
          src={HitmontopDance}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "250px" }}
          />
    </div>
    </SidebarLayout>
  );
}
