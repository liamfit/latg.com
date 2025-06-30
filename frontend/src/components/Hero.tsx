import Logo from "/logo.png";
import background from "/background.jpg";

const Hero = () => {
  return (
    <section className="w-full absolute min-h-full" role="banner">
      <img
        className="w-full h-full object-cover absolute z-[-100]"
        src={background}
        alt="Lunar and the Groove band performing live"
        loading="eager"
      />
      <div className="flex flex-col items-center justify-center mt-16">
        <img
          className="w-[30rem] h-auto object-cover z-0"
          src={Logo}
          alt="Lunar and the Groove logo"
          loading="eager"
        />
        <h1 className="text-6xl md:text-8xl lg:text-9xl uppercase drop-shadow-2xl text-orange-600 w-full text-center mt-8">
          Funk & Soul
        </h1>
        <p className="text-xl md:text-2xl text-white text-center mt-4 max-w-2xl px-4 drop-shadow-lg">
          Bringing the groove to the Midlands
        </p>
      </div>
    </section>
  );
};

export default Hero;
