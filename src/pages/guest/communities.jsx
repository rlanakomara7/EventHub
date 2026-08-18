import Header from "../../components/Header";
import CommunityHero from "../../components/CommunityHero";
import CommunityFilter from "../../components/CommunityFilter";
import CommunityList from "../../components/CommunityList";
import communities from "../../data/communities.json";
import ModalSign from "../../components/ModalSign";
import { useState } from "react";

function Communities() {
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //handle join if blm login
  function handleJoin() {
    if (!currentUser) {
      setShowModal(true);
      return;
    }
  }
  return (
    <>
      <Header title="Communities" />
      <CommunityHero />
      <CommunityFilter />
      <div className="px-3 md:px-6 lg:px-10">
        <p className="text-sm font-bold md:text-base">
          {communities.length}{" "}
          <span className="font-medium text-gray-primary/40">Communities</span>
        </p>
      </div>
      <CommunityList communities={communities} onAuthRequired={handleJoin} />
      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Communities;
