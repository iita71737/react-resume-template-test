import { FC, memo, useCallback, useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
// import Confetti from 'react-confetti';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  isSubmitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactForm: FC<ContactFormProps> = memo((props) => {
  console.log(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, 'EMAILJS_SERVICE_ID PUBLIC');

  const {
    isSubmitted,
    setSubmitted
  } = props

  const defaultData = useMemo(
    () => ({
      name: '',
      email: '',
      message: '',
    }),
    [],
  );

  const [data, setData] = useState<FormData>(defaultData);

  const onChange = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>): void => {
      const { name, value } = event.target;

      const fieldData: Partial<FormData> = { [name]: value };

      setData({ ...data, ...fieldData });
    },
    [data],
  );

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      /**
       * This is a good starting point to wire up your form submission logic
       * */
      console.log('Data to send: ', data);
      console.log(process.env.EMAILJS_SERVICE_ID, 'process.env.EMAILJS_SERVICE_ID');

      try {
        const result = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
          data as unknown as Record<string, unknown>,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string,
        );

        // show the user a success message
        console.log('Email sent:', result);

        setSubmitted(true);

        setTimeout(() => {
          setSubmitted(false);
        }, 15000);

      } catch (error) {
        // show the user an error
        console.error('Error sending email:', error);
      }
    },
    [data],
  );

  const inputClasses =
    'bg-neutral-700 border-0 focus:border-0 focus:outline-none focus:ring-1 focus:ring-orange-600 rounded-md placeholder:text-neutral-400 placeholder:text-sm text-neutral-200 text-sm';

  return isSubmitted ? (
    <div>
      <h1
        className="text-center text-3xl font-semibold"
      >
        Thank you for your message!
      </h1>
      {/* <Confetti
        width={window.innerWidth}
        recycle={true}
      /> */}
    </div>
  ) : (
    <form className="grid min-h-[320px] grid-cols-1 gap-y-4" onSubmit={handleSendMessage}>
      <input className={inputClasses} name="name" onChange={onChange} placeholder="Name" required type="text" />
      <input
        autoComplete="email"
        className={inputClasses}
        name="email"
        onChange={onChange}
        placeholder="Email"
        required
        type="email"
      />
      <textarea
        className={inputClasses}
        maxLength={250}
        name="message"
        onChange={onChange}
        placeholder="Message"
        required
        rows={6}
      />
      <button
        aria-label="Submit contact form"
        className="w-max rounded-full border-2 border-orange-600 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-stone-800 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-stone-800"
        type="submit">
        Send Message
      </button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
