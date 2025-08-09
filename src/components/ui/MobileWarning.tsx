import React from "react";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
};

const MobileWarning: React.FC = () => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const check = () => setShow(isMobile());
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 text-white text-center px-6 py-10">
      <div className="text-3xl font-bold mb-4">🚧 Mobile Version Incomplete</div>
      <div className="text-lg max-w-md">
        The mobile version of this site is still under construction.<br />
        For the best experience, please use a desktop or larger screen.<br />
        <span className="text-sm opacity-70 block mt-4">(This warning will disappear once mobile support is ready.)</span>
      </div>
    </div>
  );
};

export default MobileWarning;
