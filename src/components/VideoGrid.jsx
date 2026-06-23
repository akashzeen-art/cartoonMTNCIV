import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VideoCard from './VideoCard';
import { PlayCircle } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const cartoonVideos = [
  // ── TOM ET JERRY ──
  { id: 1,  title: "Folie Martienne",                                        episode: "Tom et Jerry",  thumbnail: "/thumnails/Foliemartienne.png",                                            duration: "10:24", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/2522c4d0-b0f5-4670-b230-bebfb9b15640/play_360p.mp4" },
  { id: 2,  title: "Un Jerry IMMENSE vs un Tom MINUSCULE",                   episode: "Tom et Jerry",  thumbnail: "/thumnails/UnJerryIMMENSEvsunTomMINUSCULE.png",                           duration: "12:10", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/a6923723-2fa6-409a-b763-f533918ca029/play_360p.mp4" },
  { id: 3,  title: "Le Chat & la Souris Détectives",                         episode: "Tom et Jerry",  thumbnail: "/thumnails/Lechat&lasourisdétectives.png",                                duration: "11:35", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/da483bd1-1577-4323-aec3-ebd5a7887527/play_360p.mp4" },
  { id: 4,  title: "Les GRANDES Aventures Fantasy de Tom et Jerry",          episode: "Tom et Jerry",  thumbnail: "/thumnails/LesGRANDESaventuresfantasydeTometJerry.png",                   duration: "14:05", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/fdd00e0a-7160-43b4-a982-1658cc4fff45/play_360p.mp4" },
  { id: 5,  title: "Tom et Jerry deviennent des RATS DE BIBLIOTHÈQUE",       episode: "Tom et Jerry",  thumbnail: "/thumnails/Tom&JerrydeviennentdesRATSDEBIBLIOTHÈQUE.png",                 duration: "13:20", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/d7db855c-3be7-4b50-94af-3dc486e3e6f5/play_360p.mp4" },
  // ── THE SMURFS ──
  { id: 6,  title: "Qui a cassé le télescope du Grand Schtroumpf ?",         episode: "Les Schtroumpfs", thumbnail: "/thumnails/QuiacasséletélescopeduGrandSchtroumpf-LesSchtroumpfs.png",   duration: "10:55", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/8626c17c-3746-4eff-92b5-2bee91a2258e/play_360p.mp4" },
  { id: 7,  title: "Un Anniversaire EXPLOSIF !",                             episode: "Les Schtroumpfs", thumbnail: "/thumnails/UnAnniversaireEXPLOSIF!.png",                              duration: "11:48", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/bf5a2e1b-7acd-4c50-bf2c-ef24a840c28d/play_360p.mp4" },
  { id: 8,  title: "Le Pouvoir du Sourire ! Les Schtroumpfs",                episode: "Les Schtroumpfs", thumbnail: "/thumnails/ePouvoirduSourire!LesSchtroumpfs.png",                      duration: "12:30", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/0078a76e-5003-4fbe-be1e-9b11da2d79af/play_360p.mp4" },
  { id: 9,  title: "Le Problème du Schtroumpf Paresseux !",                  episode: "Les Schtroumpfs", thumbnail: "/thumnails/LeProblèmeduSchtroumpfParesseux!.png",                    duration: "13:15", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/2137f703-0d3a-40cd-9387-6da8dacc0b4d/play_360p.mp4" },
  { id: 10, title: "Le Retour des Schtroumpfs ! CLIP EXCLUSIF !",            episode: "Les Schtroumpfs", thumbnail: "/thumnails/LeRetourdesSchtroumpfs!_CLIPEXCLUSIF!.png",                  duration: "14:40", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/90108240-6eaa-4c35-be0a-ee3dc7957a75/play_360p.mp4" },
  { id: 11, title: "Les deux bêtas font la paire — Les Schtroumpfs 3D",      episode: "Les Schtroumpfs", thumbnail: "/thumnails/LesdeuxbêtasfontlapaireLesSchtroumpfs3D.png",              duration: "11:05", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/ab328c2c-3261-4086-bd61-36fa5ff7e33e/play_360p.mp4" },
  // ── POKÉMON ──
  { id: 12, title: "Pokémon Évolutions — Bande-annonce 2",                   episode: "Pokémon",       thumbnail: "/thumnails/PokémonÉvolutions_Bande-annonce2.png",                       duration: "10:18", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/7fb0332a-64ee-4575-94b4-4459174de754/play_480p.mp4" },
  { id: 13, title: "L'Éclipse — Pokémon Évolutions Épisode 2",               episode: "Pokémon",       thumbnail: "/thumnails/Leclipse_PokemonEvolutions_Episode2.png",                   duration: "12:44", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/afb0272f-dc56-4742-8b28-1c514a4c2c29/play_480p.mp4" },
  { id: 14, title: "Le Plan — Pokémon Évolutions Épisode 4",                 episode: "Pokémon",       thumbnail: "/thumnails/Leplan_PokémonÉvolutions_Épisode4.png",                      duration: "11:30", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/e8219536-fe47-48f5-9c0c-521da810fecc/play_480p.mp4" },
  { id: 15, title: "Le Maître — Pokémon Évolutions Épisode 1",               episode: "Pokémon",       thumbnail: "/thumnails/LeMaîtrePokémonÉvolutions_Épisode1.png",                     duration: "13:52", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/674fbb0d-bd70-43b2-bf4d-3c8c2423455e/play_480p.mp4" },
  { id: 16, title: "Le Visionnaire — Pokémon Évolutions Épisode 3",          episode: "Pokémon",       thumbnail: "/thumnails/Levisionnaire_PokémonÉvolutions_Épisode3.png",                duration: "14:08", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/32921674-1b54-478c-b64b-d51e499960f2/play_480p.mp4" },
  // ── INSPECTOR GADGET ──
  { id: 17, title: "Gadget Magique",                                          episode: "Insp. Gadget",  thumbnail: "/thumnails/Gadgetmagique.png",                                          duration: "12:05", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/48b257f4-5b03-43da-b4dc-0bda65d3d342/play_360p.mp4" },
  { id: 18, title: "Conférence de Presse de Gadget",                          episode: "Insp. Gadget",  thumbnail: "/thumnails/ConférencedepressedeGadget.png",                            duration: "10:42", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/1ea47b38-0dc1-45e7-b344-fdb788d10289/play_360p.mp4" },
  { id: 19, title: "Gadget et le Lama",                                       episode: "Insp. Gadget",  thumbnail: "/thumnails/GadgetetleLama.png",                                         duration: "11:18", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/86df9c9e-3ff6-448d-a0f2-f64c228099f1/play_360p.mp4" },
  { id: 20, title: "Gadget et le Nain",                                       episode: "Insp. Gadget",  thumbnail: "/thumnails/GadgetetleNain.png",                                         duration: "13:36", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/906e7984-fc2b-4f87-a9d4-693194db3eb5/play_360p.mp4" },
  { id: 21, title: "Gadget le Somnambule",                                    episode: "Insp. Gadget",  thumbnail: "/thumnails/Gadgetlesomnambule.png",                                     duration: "10:55", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/a196a47d-232b-451d-b37f-cc3feb1d2163/play_360p.mp4" },
  // ── HEY ARNOLD! ──
  { id: 22, title: "Hé Arnold ! La Canicule",                                 episode: "Hé Arnold !",   thumbnail: "/thumnails/HéArnold_Canicule!.png",                                    duration: "14:22", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/40bf88e3-a61b-4100-88cf-29cd927dbfa2/play_360p.mp4" },
  { id: 23, title: "Hé Arnold ! Monsieur Smith",                              episode: "Hé Arnold !",   thumbnail: "/thumnails/HéArnoldMonsieurSmith.png",                                 duration: "12:48", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/2ec5da75-7296-45ac-b2d0-6ae0e73a11dd/play_360p.mp4" },
  { id: 24, title: "Hé Arnold ! La Soirée de Filles",                         episode: "Hé Arnold !",   thumbnail: "/thumnails/HéArnold_Lasoiréedefilles.png",                             duration: "11:33", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/cae0d957-8555-4659-82b2-68ea0a16dd31/play_360p.mp4" },
  { id: 25, title: "Hé Arnold ! Le Petit Carnet Rose",                        episode: "Hé Arnold !",   thumbnail: "/thumnails/HéArnoldLepetitcarnetrose.png",                             duration: "13:07", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/fdc3ce53-71c5-4a34-961d-e0b7f461ce30/play_360p.mp4" },
  { id: 26, title: "Hé Arnold ! Le Samedi Parfait",                           episode: "Hé Arnold !",   thumbnail: "/thumnails/HéArnold_Lesamediparfait.png",                              duration: "14:50", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/7ba8e7fe-aeb4-4f73-b12f-4ddcbb86eeb4/play_360p.mp4" },
  // ── DRAGON BALL Z ──
  { id: 27, title: "Résumé Complet Saga Babidi",                              episode: "Dragon Ball Z", thumbnail: "/thumnails/RésuméCompletSagaBabidi.png",                               duration: "15:00", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/78021cad-e44c-4a44-99f8-a97e6eff2dc0/play_360p.mp4" },
  { id: 28, title: "Dragon Ball Z — Méga Compilation Résumé Complet Saga Boo", episode: "Dragon Ball Z", thumbnail: "/thumnails/DragonBallZ-MégaCompilation-RésuméCompletSagaBoo.png",    duration: "14:35", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/52d5d1d3-9a0d-422e-8dbb-b4c21220b4cb/play_360p.mp4" },
  { id: 29, title: "Méga Compilation — Résumé Complet",                       episode: "Dragon Ball Z", thumbnail: "/thumnails/MégaCompilation-RésuméComplet.png",                        duration: "12:22", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/43431630-339a-4d35-980e-0f7e81725fef/play_360p.mp4" },
  { id: 30, title: "Méga Compilation — Résumé Complet Saga",                  episode: "Dragon Ball Z", thumbnail: "/thumnails/MégaCompilation-RésuméCompletSaga.png",                    duration: "13:45", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/a9eb901f-402e-43e8-b554-dc564c4ef48e/play_360p.mp4" },
  { id: 31, title: "Méga Compilation — Résumé Comp.",                         episode: "Dragon Ball Z", thumbnail: "/thumnails/MégaCompilation-RésuméComp.png",                           duration: "11:58", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/c5bb9448-1527-4674-9d5f-7c05c4664b63/play_360p.mp4" },
];

const VideoGrid = () => {
  const navigate = useNavigate();
  const { requestPlay } = useSubscription();

  return (
    <section id="videos" style={{ padding: '80px 0', background: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '50px' }}>
          <PlayCircle size={40} color="#FF6B6B" />
          <h2 style={{ fontSize: '3rem', color: '#1A535C', textTransform: 'uppercase' }}>
            Tous les Épisodes
          </h2>
        </div>

        {/* Grid */}
        <div className="video-grid">
          {cartoonVideos.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              onClick={() => requestPlay(video)}
            />
          ))}
        </div>

        {/* Load More */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/coloring')}
            className="cartoon-btn bg-pink"
            style={{ padding: '20px 60px', color: 'white', fontSize: '1.4rem' }}
          >
            PLUS D'AVENTURES !
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;
