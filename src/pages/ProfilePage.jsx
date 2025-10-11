import Button from "../components/Button";
import Input from "../components/Input";

function ProfilePage() {
  return (
    <div className="px-4 py-6 mt-16 mb-10 sm:px-6 sm:py-8 sm:mt-20 md:px-10 md:mb-16 lg:px-16 xl:px-20 lg:mb-20">
      <h1 className="text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">
        Profile
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] mt-5 sm:mt-6 md:mt-8 lg:mt-10 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 md:p-10 flex flex-col gap-4 sm:gap-5 border border-[#E8E8E8] items-center h-max rounded-lg md:rounded-none">
          <div className="text-center">
            <h2 className="font-medium text-lg sm:text-xl text-[#0B132A]">
              Ghaluh Wizard
            </h2>
            <p className="text-[#4F5665] text-sm sm:text-base">
              Email@gamil.com
            </p>
          </div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <img
              className="object-cover w-full h-full rounded-full"
              src="/public/img-menus/image1.png"
              alt="Profile"
            />
          </div>
          <Button className="bg-[#FF8906] py-4 w-full text-sm sm:text-base">
            Upload New Photo
          </Button>
          <div>
            Since{" "}
            <span className="font-semibold text-[#4F5665]">
              20 January 2022
            </span>
          </div>
        </div>
        <div className="border border-[#E8E8E8] py-5 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-5 sm:gap-6 md:gap-7 rounded-lg md:rounded-none">
          <Input
            id="fullName"
            type="text"
            label="Full Name"
            placeholder="Itsna Maulanana"
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="hasanmaulana453@gmail.com"
          />
          <Input id="phone" type="number" label="Phone" placeholder="0987654" />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="*******"
            passwordInProfile={true}
          />
          <Input
            id="address"
            type="text"
            label="Address"
            placeholder="Pati semarang"
          />
          <Button className="bg-[#FF8906] w-full sm:w-auto text-sm sm:text-base mt-2">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
