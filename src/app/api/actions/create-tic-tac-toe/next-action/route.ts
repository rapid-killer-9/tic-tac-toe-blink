import {
  createActionHeaders,
  NextActionPostRequest,
  ActionError,
  CompletedAction,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";

import {
  CreateTicTacToeResponse,
  CLUSTER_TYPES,
  ITicTacToeGame,
  VERIFIED_CURRENCY,
} from "@/common/types";
import logger from "@/common/logger";
import { getRequestParam } from "@/common/helper/getParams";
import { GenericError } from "@/common/helper/error";
import { createTicTacToeGame} from "@/common/utils/api.util";
import { StatusCodes } from "http-status-codes";
import { jsonResponse, Promisify } from "@/common/helper/responseMaker";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    /////////////////////////////////////
    /////////Extract Params//////////////
    /////////////////////////////////////
    const requestUrl = new URL(req.url);
    const clusterurl = getRequestParam<CLUSTER_TYPES>(requestUrl, "clusterurl");
    const name = getRequestParam<string>(requestUrl, "name");
    const token = getRequestParam<VERIFIED_CURRENCY>(requestUrl, "token");
    const wager = getRequestParam<number>(requestUrl, "wager");
    const startDate = getRequestParam<number>(requestUrl, "startDate");
    const endDate = getRequestParam<number>(requestUrl, "endDate");

    /////////////////////////////////////
    /////////Extract Account/////////////
    /////////////////////////////////////
    const body: NextActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch {
      throw new GenericError("Invalid account provided", StatusCodes.BAD_REQUEST);
    }

    let signature: string;
    try {
      signature = body.signature!;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw new GenericError('Invalid "signature" provided', StatusCodes.BAD_REQUEST);
    }
    /////////////////////////////////////
    ///////////Parse Phase///////////////
    /////////////////////////////////////
    const ticTacToeData: ITicTacToeGame = {
      Name: name,
      account: account.toString(),
      token,
      wager,
      startDate,
      endDate,
    };
    const response = await Promisify<CreateTicTacToeResponse>(
      createTicTacToeGame(clusterurl, ticTacToeData),
    );
    const basicUrl = new URL(req.url).origin;
    const icons = {
      name: new URL("/tic-tac-toe.png", basicUrl).toString(), // TODO: edit link here
    };

    const message = `Your Tic Tac Toe challenge has been created successfully!\nJoin with blink: https://dial.to/?action=solana-action%3Ahttps%3A%2F%2F${basicUrl}%2Fapi%2Factions%2Fcreate-tic-tac-toe%3Fclusterurl%3D${clusterurl}%26gameID%3D${response.gameID}&cluster=${clusterurl}`;
    logger.info(`[Create Tic Tac Toe next action] final response: ${message}`);
    const payload: CompletedAction = {
      type: "completed",
      title: "Your Tic Tac Toe Challenge Has Been Created Successfully!",
      icon: icons.name,
      label: "Catoff Tic Tac Toe Challenge Created",
      description: message,
    };

    return jsonResponse(payload, StatusCodes.OK, headers);
  } catch (err) {
    logger.error(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return jsonResponse(actionError, StatusCodes.BAD_REQUEST, headers);
  }
};
