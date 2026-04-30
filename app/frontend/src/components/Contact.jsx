Now wire the Contact form to the backend:
Action: file_editor str_replace /app/frontend/src/components/Contact.jsx --old-str "import React, { useState } from \"react\";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from \"lucide-react\";
import { Button } from \"./ui/button\";
import { Input } from \"./ui/input\";
import { Textarea } from \"./ui/textarea\";
import { Label } from \"./ui/label\";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from \"./ui/select\";
import { useToast } from \"../hooks/use-toast\";
import { personal, testimonials } from \"../mock\";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: \"\", email: \"\", budget: \"\", message: \"\"
  });

  const handleChange = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: \"Missing details\",
        description: \"Please fill in your name, email, and a short message.\",
        variant: \"destructive\"
      });
      return;
    }
    // Save locally for mock
    const existing = JSON.parse(localStorage.getItem(\"contact_msgs\") || \"[]\");
    localStorage.setItem(
      \"contact_msgs\",
      JSON.stringify([...existing, { ...form, at: new Date().toISOString() }])
    );
    setSubmitted(true);
    toast({
      title: \"Message sent\",
      description: \"Thanks! I'll get back to you within 1–2 business days.\"
    });
    setForm({ name: \"\", email: \"\", budget: \"\", message: \"\" });
    setTimeout(() => setSubmitted(false), 4000);
  };" --new-str "import React, { useState } from \"react\";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from \"lucide-react\";
import { Button } from \"./ui/button\";
import { Input } from \"./ui/input\";
import { Textarea } from \"./ui/textarea\";
import { Label } from \"./ui/label\";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from \"./ui/select\";
import { useToast } from \"../hooks/use-toast\";
import { personal, testimonials } from \"../mock\";
import { sendContact } from \"../api\";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: \"\", email: \"\", budget: \"\", message: \"\"
  });

  const handleChange = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: \"Missing details\",
        description: \"Please fill in your name, email, and a short message.\",
        variant: \"destructive\"
      });
      return;
    }
    if (form.message.length < 10) {
      toast({
        title: \"Message too short\",
        description: \"Please share at least a couple of sentences.\",
        variant: \"destructive\"
      });
      return;
    }
    try {
      setLoading(true);
      await sendContact({
        name: form.name,
        email: form.email,
        budget: form.budget || null,
        message: form.message,
      });
      setSubmitted(true);
      toast({
        title: \"Message sent\",
        description: \"Thanks! I'll get back to you within 1–2 business days.\"
      });
      setForm({ name: \"\", email: \"\", budget: \"\", message: \"\" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let description = \"Something went wrong. Please try again.\";
      if (Array.isArray(detail) && detail[0]?.msg) {
        description = detail[0].msg;
      } else if (typeof detail === \"string\") {
        description = detail;
      }
      toast({
        title: \"Couldn't send message\",
        description,
        variant: \"destructive\"
      });
    } finally {
      setLoading(false);
    }
  };
"
Observation: Edit was successful.
