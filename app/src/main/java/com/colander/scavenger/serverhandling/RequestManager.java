package com.colander.scavenger.serverhandling;

import android.util.Pair;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.colander.scavenger.AccountContainer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by colander on 11/29/15.
 */
public class RequestManager {
    private String serverIP = "http://10.0.0.43:8081/";
    private String MAP_REQUEST = "MAP";
    private String CLAIM_REQUEST = "CLAIM";
    private RequestQueue queue;
    public final static int NODES_ID = 1;

    public RequestManager(RequestQueue queue) {
        this.queue = queue;
    }

    public <T extends JSONArrayCallbackInterface> void getAllNodesJSON(final T callback) {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, serverIP + MAP_REQUEST,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        System.out.println("GOT RESPONSE");
                        try {
                            JSONArray json = new JSONObject(response).getJSONArray("result");
                            callback.onJSONResponse(json, NODES_ID);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("REQUEST ERROR " + error.getMessage());

            }
        });
        queue.add(stringRequest);
    }

    public <T extends JSONCallbackInterface> void claimNode(String id, String qr, final T callback) {
        System.out.printf("JSON request sent");
        JSONObject request = new JSONObject();
        try {
            request.put("token", AccountContainer.getAccount().getIdToken());
            request.put("nodeID", id);
            request.put("qr", "testQR");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonPostRequest(request, serverIP + CLAIM_REQUEST, callback);
    }

    public <T extends JSONCallbackInterface> void JsonPostRequest(JSONObject jsonObject, String url, final T callback) {
        queue.add(new JsonObjectRequest(url, jsonObject, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                System.out.println("JSON request successful");
                callback.onJSONResponse(response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("JSON request unsuccessful " + error.getMessage());
            }
        }));
    }
}
