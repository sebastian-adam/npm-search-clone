import { Typography } from "@mui/material";

const Blankslate = () => {
  return (
    <div className="p-12 flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500">
      <Typography variant="h1" className="text-white font-semibold pb-16">
        Build amazing things
      </Typography>
      <Typography className="text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu
        placerat mauris. Sed lobortis sed sem non auctor. Suspendisse volutpat
        vel risus accumsan scelerisque. Ut tempor porttitor gravida. Suspendisse
        id purus libero. Vestibulum maximus ante id lorem vulputate vulputate
        eget id urna. Etiam vitae euismod justo. Mauris in pellentesque metus.
        Curabitur in urna in neque mollis aliquet.
      </Typography>
    </div>
  );
};

export default Blankslate;
