import { Router } from "express";
import { submitContact, getContacts, updateContactStatus } from "../controllers/contact.controller.js";


const router = Router();

router.post("/submit", submitContact);  // User submits contact form
router.get("/get", getContacts);  // Admin fetches contact requests
router.put("/update/:id", updateContactStatus);  // Admin updates status

export default router;
