import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  try {
    const { id: matchId } = matchIdParamSchema.parse(req.params);
    const query = listCommentaryQuerySchema.parse(req.query);
    
    const limit = Math.min(query.limit ?? MAX_LIMIT, MAX_LIMIT);

    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }
    console.error("Error fetching commentary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

commentaryRouter.post("/", async (req, res) => {
  try {
    const { id: matchId } = matchIdParamSchema.parse(req.params);
    const body = createCommentarySchema.parse(req.body);

    const [newCommentary] = await db.insert(commentary).values({
      matchId,
      minute: body.minute,
      sequence: body.sequence,
      period: body.period,
      eventType: body.eventType,
      actor: body.actor,
      team: body.team,
      message: body.message,
      metaData: body.metadata,
      tags: body.tags
    }).returning();

    if (req.app.locals.broadcastCommentary) {
      req.app.locals.broadcastCommentary(matchId, newCommentary);
    }

    res.status(201).json({
      success: true,
      data: newCommentary,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }
    console.error("Error creating commentary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
