import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Chip,
} from "@mui/material";
import type { Package } from "@/pages/api/search";

interface ListItemProps {
  item: Package;
  onClick: () => void;
}

export default function ListItem({ item, onClick }: ListItemProps) {
  return (
    <Card className="border-b !rounded-none border-slate-300 !shadow-none">
      <CardActionArea onClick={onClick}>
        <CardContent className="flex flex-col space-y-2 overflow-hidden">
          <Typography variant="button">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
          <div className="flex items-center space-x-4 overflow-auto">
            {item.keywords?.map((keyword, index) => (
              <Chip key={index} label={keyword} />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
