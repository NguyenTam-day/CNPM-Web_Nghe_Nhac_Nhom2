import { clerkClient, verifyToken } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	try {
		// Try to get userId from clerkMiddleware first
		let userId = req.auth?.userId;
		
		// If no userId from clerkMiddleware, try to extract from Authorization header
		if (!userId) {
			const authHeader = req.headers.authorization;
			if (authHeader?.startsWith("Bearer ")) {
				const token = authHeader.substring(7);
				console.log("🔑 Verifying Bearer token...");
				
				try {
					const decoded = await verifyToken(token, {
						secretKey: process.env.CLERK_SECRET_KEY,
					});
					userId = decoded.sub;
					console.log("✅ Token verified from Authorization header:", userId);
					req.auth = { userId };
				} catch (tokenError) {
					console.error("❌ Token verification failed:", tokenError.message);
					return res.status(401).json({ message: "Invalid or expired token" });
				}
			}
		}

		if (!userId) {
			console.log("❌ No userId found - unauthorized");
			return res.status(401).json({ message: "Unauthorized - you must be logged in" });
		}

		console.log("✅ User authenticated:", userId);
		next();
	} catch (error) {
		console.error("❌ Error in protectRoute:", error);
		next(error);
	}
};

export const requireAdmin = async (req, res, next) => {
	try {
		console.log("👨‍💼 requireAdmin - checking admin status for userId:", req.auth.userId);

		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const userEmail = currentUser.primaryEmailAddress?.emailAddress;
		const adminEmail = process.env.ADMIN_EMAIL;

		console.log("📧 User email:", userEmail);
		console.log("📧 Admin email:", adminEmail);

		const isAdmin = adminEmail === userEmail;

		if (!isAdmin) {
			console.log("❌ User is NOT admin");
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		console.log("✅ User is admin - proceeding");
		next();
	} catch (error) {
		console.error("❌ Error in requireAdmin middleware:", error);
		next(error);
	}
};
