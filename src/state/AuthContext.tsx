import { getLocalStorage } from "../utils/getLocalStorage";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextInterface {
  user: FirebaseUser | null;
  setUser: Dispatch<SetStateAction<FirebaseUser | null>>;
  company: string;
  setCompany: Dispatch<SetStateAction<string>>;
}

const AuthContext = createContext({} as AuthContextInterface);

export const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  //Stored data for user and company
  const [user, setUser] = useState(getLocalStorage("user") || null);
  const [company, setCompany] = useState(getLocalStorage("company") || null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));

    //Firebase query -> při změně usera uložení company, pod kterou user pracuje
    const fetchCompany = async () => {
      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompany(docSnap.data().company);
        localStorage.setItem("company", JSON.stringify(docSnap.data().company));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchCompany();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        company,
        setCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
