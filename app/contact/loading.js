// app/contact/loading.js

import GearLoader from "../../components/GearLoader";

export default function Loading() {
  return <GearLoader fullScreen={true} text="Initializing Contact Desk..." />;
}